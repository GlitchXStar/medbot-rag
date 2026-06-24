import sys
import time
from pathlib import Path
from typing import List, Optional

from langchain.schema import Document
from langchain_core.embeddings import Embeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from tqdm import tqdm

from src.retrieval.multi_query import create_multi_query_retriever
from src.rag_chain import get_llm


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from config import (
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME,
    PINECONE_ENVIRONMENT,
    OPENAI_EMBEDDING_MODEL,
    EMBEDDING_DIMENSION,
    RETRIEVER_TOP_K,
)

from src.logger import get_logger
logger = get_logger(__name__)

BATCH_SIZE = 100


def get_embeddings() -> Embeddings:
    logger.info(f"Loading embedding model: {OPENAI_EMBEDDING_MODEL}")
    return HuggingFaceEmbeddings(model_name=OPENAI_EMBEDDING_MODEL)


def get_pinecone_client() -> Pinecone:
    return Pinecone(api_key=PINECONE_API_KEY)


def create_index_if_not_exists(pc: Pinecone) -> None:
    existing = [idx.name for idx in pc.list_indexes()]

    if PINECONE_INDEX_NAME in existing:
        logger.info(
            f"Using existing Pinecone index '{PINECONE_INDEX_NAME} [dim={EMBEDDING_DIMENSION}]"
        )
        return

    logger.info(
        f"Creating a new index '{PINECONE_INDEX_NAME} [dim={EMBEDDING_DIMENSION}]"
    )

    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=EMBEDDING_DIMENSION,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region=PINECONE_ENVIRONMENT
        )
    )

    logger.info("Waiting for index to be ready")

    while not pc.describe_index(PINECONE_INDEX_NAME).status["ready"]:
        time.sleep(2)

    logger.info("Index is ready")


def upsert_documents(chunks: List[Document]) -> PineconeVectorStore:
    if not chunks:
        raise ValueError("No document chunks supplied.")

    pc = get_pinecone_client()
    create_index_if_not_exists(pc)
    embeddings = get_embeddings()

    logger.info(f"Upserting {len(chunks)} chunks to Pinecone...")
    batches = [chunks[i:i + BATCH_SIZE] for i in range(0, len(chunks), BATCH_SIZE)]

    vectorstore = None

    for i, batch in enumerate(tqdm(batches, desc="Uploading to Pinecone")):
        try:
            if vectorstore is None:
                vectorstore = PineconeVectorStore.from_documents(
                    documents=batch,
                    embedding=embeddings,
                    index_name=PINECONE_INDEX_NAME
                )

            else:
                vectorstore.add_documents(
                    documents=batch
                )

        except Exception as e:
            logger.error(f"Batch {i + 1} failed : {e}")
            raise RuntimeError("Pinecone upload failed.") from e

        time.sleep(0.3)

    logger.info(f"✅ Done - {len(chunks)} chunks stored in Pinecone")
    return vectorstore


def load_vectorstore() -> PineconeVectorStore:
    logger.info(f"Loading Pinecone index '{PINECONE_INDEX_NAME}'")

    vectorstore = PineconeVectorStore(
        index_name=PINECONE_INDEX_NAME,
        embedding=get_embeddings(),
        pinecone_api_key=PINECONE_API_KEY,
    )

    logger.info("Vectorstore loaded successfully")
    return vectorstore


def get_retriever(vectorstore: Optional[PineconeVectorStore] = None):
    if vectorstore is None:
        vectorstore = load_vectorstore()

    retriever = (
        vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={
                "k": RETRIEVER_TOP_K,
            }
        )
    )

    return retriever

def get_multi_query_retriever(
        vectorstore: Optional[PineconeVectorStore] = None
):

    if vectorstore is None:
        vectorstore = load_vectorstore()

    llm = get_llm()

    retriever = create_multi_query_retriever(
        vectorstore=vectorstore,
        llm=llm
    )

    return retriever


def get_index_stats() -> dict:
    pc = get_pinecone_client()
    index = pc.Index(PINECONE_INDEX_NAME)
    stats = index.describe_index_stats()

    return {
        "index_name": PINECONE_INDEX_NAME,
        "total_vectors": stats.total_vector_count,
        "dimension": stats.dimension,
    }

if __name__ == "__main__":
    logger.info("Starting vectorstore ingestion...")

    from src.ingestion import load_and_chunk

    chunks = load_and_chunk("data/The-Gale-Encyclopedia-of-Medicine.pdf")
    upsert_documents(chunks)

    logger.info("Vectorstore pipeline completed")