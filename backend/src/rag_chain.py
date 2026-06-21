import sys
from pathlib import Path
from typing import Any, Dict, List

from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from config import (
    OPENAI_API_KEY,
    OPENAI_API_BASE,
    OPENAI_LLM_MODEL,
    LLM_TEMPERATURE,
    MAX_TOKENS_RESPONSE
)

from src.logger import get_logger


log = get_logger(__name__)


PROMPT_TEMPLATE = """
You are MedBot, an expert medical assistant built on the Gale Encyclopedia of Medicine (3rd Edition).
You help doctors and medical professionals get accurate, well-structured medical information instantly.

RULES:
- Answer ONLY from the provided context below.
- Use proper medical terminology.
- Structure your answer clearly: always start with a brief definition, then cover causes, symptoms, diagnosis, and treatment where relevant.
- If the context does not have enough information, say: "I don't have sufficient information in the encyclopedia to answer this accurately."
- Never fabricate or guess medical facts.
- Be thorough but precise. Doctors value accuracy over brevity.

Structure your answer in the following format:

1. Definition
2. Causes
3. Symptoms (detailed)
4. Diagnosis
5. Treatment
6. Prevention
7. Complications if untreated

Give a comprehensive explanation for each section.
Do not shorten the response.
Use complete sentences and provide medically detailed information.

CONTEXT FROM GALE ENCYCLOPEDIA:

{context}

QUESTION: {question}

ANSWER:
"""


PROMPT = PromptTemplate(
    template=PROMPT_TEMPLATE,
    input_variables=["context", "question"]
)

import json
import time
import requests as _requests


# BharatCode uses this Supabase project for auth
_BHARATCODE_SUPABASE_URL = "https://evgvlcaxfpwupaiwzqqm.supabase.co"


def _refresh_bharatcode_token(creds_path: Path, refresh_token: str) -> str | None:
    """Use the Supabase refresh_token to get a new access_token."""
    try:
        resp = _requests.post(
            f"{_BHARATCODE_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token",
            json={"refresh_token": refresh_token},
            headers={
                "Content-Type": "application/json",
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"  # public anon key placeholder
            },
            timeout=15
        )

        if resp.status_code == 200:
            data = resp.json()
            # Update the credentials file with the new tokens
            new_creds = {
                "access_token": data["access_token"],
                "refresh_token": data.get("refresh_token", refresh_token),
                "token_type": "bearer",
                "expires_at": int(time.time()) + data.get("expires_in", 3600),
            }

            # Preserve existing user info
            try:
                old_creds = json.loads(creds_path.read_text(encoding="utf-8"))
                if "user" in old_creds:
                    new_creds["user"] = old_creds["user"]
                if "id_token" in data:
                    new_creds["id_token"] = data["id_token"]
            except Exception:
                pass

            creds_path.write_text(
                json.dumps(new_creds, indent=2),
                encoding="utf-8"
            )

            log.info("BharatCode token refreshed successfully")
            return data["access_token"]
        else:
            log.warning(f"Token refresh failed ({resp.status_code}): {resp.text[:200]}")
    except Exception as e:
        log.warning(f"Token refresh request failed: {e}")

    return None


def _get_bharatcode_token() -> str:
    """Read the live OAuth access token from BharatCode credentials.

    BharatCode stores a JWT access_token in ~/.bharatcode/credentials.json
    after `bharatcode auth login`. If the token has expired, this function
    attempts to auto-refresh using the stored refresh_token.
    Falls back to the OPENAI_API_KEY from .env if unavailable.
    """
    creds_path = Path.home() / ".bharatcode" / "credentials.json"

    if creds_path.exists():
        try:
            creds = json.loads(creds_path.read_text(encoding="utf-8"))
            token = creds.get("access_token")
            expires_at = creds.get("expires_at", 0)
            refresh_token = creds.get("refresh_token")

            # Check if token is expired (with 60s buffer)
            if expires_at and time.time() > (expires_at - 60):
                log.info("BharatCode token expired, attempting auto-refresh...")

                if refresh_token:
                    new_token = _refresh_bharatcode_token(creds_path, refresh_token)

                    if new_token:
                        return new_token

                log.warning(
                    "Auto-refresh failed. Run `bharatcode auth login` to re-authenticate."
                )

            if token:
                log.info("Using BharatCode OAuth token from credentials.json")
                return token
        except (json.JSONDecodeError, KeyError) as e:
            log.warning(f"Could not read BharatCode credentials: {e}")

    log.warning("BharatCode credentials not found, falling back to OPENAI_API_KEY")
    return OPENAI_API_KEY


def get_llm(streaming: bool = False) -> ChatOpenAI:
    return ChatOpenAI(
        model=OPENAI_LLM_MODEL,
        temperature=LLM_TEMPERATURE,
        max_tokens=MAX_TOKENS_RESPONSE,
        openai_api_key=_get_bharatcode_token(),
        openai_api_base=OPENAI_API_BASE,
        streaming=streaming
    )


def _create_chain(retriever, streaming: bool = False) -> RetrievalQA:
    llm = get_llm(
        streaming=streaming
    )

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={
            "prompt": PROMPT,
            "verbose": False
        }
    )
    return chain


def build_rag_chain(retriever) -> RetrievalQA:
    chain = _create_chain(
        retriever=retriever,
        streaming=False
    )

    log.info(
        f"RAG chain initialized | model={OPENAI_LLM_MODEL}"
    )

    return chain


def build_streaming_chain(retriever) -> RetrievalQA:
    chain = _create_chain(
        retriever=retriever,
        streaming=True
    )

    log.info(
        f"Streaming RAG chain initialized | model={OPENAI_LLM_MODEL}"
    )

    return chain


def ask(chain: RetrievalQA, question: str) -> Dict[str, Any]:
    if not question.strip():
        return {
            "answer": "Please provide a valid question.",
            "sources": []
        }

    log.info(
        f"Question received: {question[:80]}"
    )

    result = chain.invoke({
        "query": question
    })

    answer = result.get(
        "result",
        "No answer generated."
    )

    source_docs: List = result.get(
        "source_documents",
        []
    )

    seen = set()
    sources = []

    for doc in source_docs:
        page = doc.metadata.get(
            "page",
            "?"
        )

        if page not in seen:
            seen.add(page)

            sources.append({
                "page": page,
                "preview": doc.page_content[:150].replace("\n", " ") + "..."
            })

    log.info(
        f"Answer generated | sources={len(sources)}"
    )

    return {
        "answer": answer,
        "sources": sources
    }