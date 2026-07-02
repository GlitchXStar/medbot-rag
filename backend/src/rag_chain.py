import sys
import time
from pathlib import Path
from typing import Any, Dict

from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

import json
import requests as _requests

from src.retrieval.reranker import DocumentReranker

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


# =========================
# PROMPT
# =========================

PROMPT_TEMPLATE = """You are MedBot, an expert medical assistant built on the Gale Encyclopedia of Medicine (3rd Edition).
You help doctors and medical professionals get accurate, well-structured medical information instantly.

RULES:
- Use the provided context as the primary source of truth.
- Combine information from multiple retrieved passages when needed.
- Use proper medical terminology.
- Structure the answer clearly and professionally.
- If the context partially answers the question, synthesize the best possible answer using available evidence.
- Only say "I don't have sufficient information in the encyclopedia to answer this accurately." if the retrieved context is completely unrelated to the question.

CONTEXT FROM GALE ENCYCLOPEDIA:
{context}

QUESTION: {question}

Provide the best medically accurate answer using the retrieved context as primary evidence. If information is partial, synthesize the most likely explanation supported by the available evidence:
"""

PROMPT = PromptTemplate(
    template=PROMPT_TEMPLATE,
    input_variables=["context", "question"]
)


# =========================
# BHARATCODE AUTH
# =========================

_BHARATCODE_SUPABASE_URL = "https://evgvlcaxfpwupaiwzqqm.supabase.co"


def _refresh_bharatcode_token(creds_path: Path, refresh_token: str) -> str | None:
    try:
        resp = _requests.post(
            f"{_BHARATCODE_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token",
            json={"refresh_token": refresh_token},
            headers={
                "Content-Type": "application/json",
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
            },
            timeout=15
        )

        if resp.status_code == 200:
            data = resp.json()

            new_creds = {
                "access_token": data["access_token"],
                "refresh_token": data.get("refresh_token", refresh_token),
                "token_type": "bearer",
                "expires_at": int(time.time()) + data.get("expires_in", 3600),
            }

            try:
                old_creds = json.loads(
                    creds_path.read_text(encoding="utf-8")
                )

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

    except Exception as e:
        log.warning(f"Token refresh request failed: {e}")

    return None


def _get_bharatcode_token() -> str:
    creds_path = Path.home() / ".bharatcode" / "credentials.json"

    if creds_path.exists():
        try:
            creds = json.loads(
                creds_path.read_text(encoding="utf-8")
            )

            token = creds.get("access_token")
            expires_at = creds.get("expires_at", 0)
            refresh_token = creds.get("refresh_token")

            if expires_at and time.time() > (expires_at - 60):

                log.info("Token expired, refreshing...")

                if refresh_token:
                    new_token = _refresh_bharatcode_token(
                        creds_path,
                        refresh_token
                    )

                    if new_token:
                        return new_token

            if token:
                log.info("Using BharatCode OAuth token")
                return token

        except Exception as e:
            log.warning(f"Could not read credentials: {e}")

    log.warning("Using fallback OPENAI_API_KEY")
    return OPENAI_API_KEY


# =========================
# LLM
# =========================

def get_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=OPENAI_LLM_MODEL,
        temperature=LLM_TEMPERATURE,
        max_tokens=MAX_TOKENS_RESPONSE,
        openai_api_key=_get_bharatcode_token(),
        openai_api_base=OPENAI_API_BASE
    )


# =========================
# CUSTOM RAG PIPELINE
# =========================

class MedBotRAG:

    def __init__(self, retriever):
        self.retriever = retriever
        self.reranker = DocumentReranker()
        self.llm = get_llm()

    def retrieve_documents(self, question):

        # -------- Retrieval timing --------
        retrieval_start = time.time()

        docs = self.retriever.invoke(question)

        retrieval_time = time.time() - retrieval_start
        log.info(f"Retrieved {len(docs)} documents")
        log.info(f"Retrieval took {retrieval_time:.2f} seconds")

        # -------- Reranking timing --------
        rerank_start = time.time()

        reranked_docs = self.reranker.rerank(
            query=question,
            docs=docs,
            top_k=8
        )

        rerank_time = time.time() - rerank_start
        log.info(f"Reranked to top {len(reranked_docs)} documents")
        log.info(f"Reranking took {rerank_time:.2f} seconds")

        return reranked_docs

    def generate_answer(self, question, docs):

        context = "\n\n".join(
            [doc.page_content for doc in docs]
        )

        prompt = PROMPT.format(
            context=context,
            question=question
        )

        # -------- Generation timing --------
        generation_start = time.time()

        response = self.llm.invoke(prompt)

        generation_time = time.time() - generation_start
        log.info(f"LLM generation took {generation_time:.2f} seconds")

        return response.content


# =========================
# BUILD CHAIN
# =========================

def build_rag_chain(retriever):

    rag = MedBotRAG(retriever)

    log.info("Custom RAG pipeline initialized")

    return rag


# =========================
# ASK FUNCTION
# =========================

def ask(chain, question: str) -> Dict[str, Any]:

    if not question.strip():
        return {
            "answer": "Please provide a valid question.",
            "sources": []
        }

    total_start = time.time()

    log.info(
        f"Question received: {question[:80]}"
    )

    # retrieve + rerank
    source_docs = chain.retrieve_documents(
        question
    )

    # generate answer
    answer = chain.generate_answer(
        question,
        source_docs
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

    total_time = time.time() - total_start

    log.info(
        f"Answer generated | sources={len(sources)}"
    )

    log.info(
        f"TOTAL PIPELINE TIME: {total_time:.2f} seconds"
    )

    return {
        "answer": answer,
        "sources": sources
    }
    