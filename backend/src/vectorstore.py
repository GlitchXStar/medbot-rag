import sys
import time
from pathlib import Path
from typing import List,Optional

from langchain.schema import Document
from langchain_huggingface import embeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone , ServerlessSpec
from tqdm import tqdm


sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from config import (
    OPENAI_API_KEY,
    PINECONE_API_KEY,
    PINECONE_ENVIRONMENT,
    PINECONE_INDEX_NAME,
    EMBEDDING_DIMENSION,
    EMBEDDING_MODEL,
    RETRIEVER_TOP_K,
)
from src.logger import get_logger

log = get_logger(__name__)

BATCH_SIZE = 100

def get_embeddings() -> Embeddings: 
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL , 
        open_api_key=OPENAI_API_KEY
        )

def get_pinecone_client() :
    return Pinecone(api_key=PINECONE_API_KEY)


def create_index_if_not_exists(pc:Pinecone) -> None:
    existing = [idx.name for idx in pc.list_indexes()]
    if PINECONE_INDEX_NAME in existing:
        log.info(f"index'{PINECONE_INDEX_NAME} [dim={EMBEDDING_DIMENSION}]")
        return
    
    log.info(f"Creating index'{PINECONE_INDEX_NAME} [dim={EMBEDDING_DIMENSION}]")

    
    
    
