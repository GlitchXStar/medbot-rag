import re
import sys
from pathlib import Path
from typing import List

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from pypdf import PdfReader

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from config import CHUNK_SIZE , CHUNK_OVERLAP
from src.logger import get_logger

log = get_logger(__name__)

def clean_text(text:str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"^\s*\d+\s*$", "", text, flags=re.MULTILINE)
    text = text.replace("\u2039", "'").replace("\u2014", "--")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2018", "'").replace("\u2019", "'")
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r" +\n", "\n", text)
    return text.strip()


def load_pdf(file_path:Path) -> List[Document] :
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF not found : {path}")

    log.info(f"Loading PDF : {path.name}")
    reader = PdfReader(str(path))
    total_pages = len(reader.pages)
    log.info(f"Total Pages: {total_pages}")

    documents = []
    for page_num, page in enumerate(reader.pages, start=1):
        try:
            raw = page.extract_text() or ""
            clean = clean_text(raw)

            if len(clean) < 50:
                continue

            documents.append(
                Document(
                    page_content=clean,
                    metadata={
                        "source": path.name,
                        "page": page_num,
                        "total_pages": total_pages
                    }
                )
            )

        except Exception as e:
            log.warning(f"Failed to parse page {page_num}: {e}")
            continue

        if page_num % 200 == 0:
            log.info(f"Processed {page_num}/{total_pages} pages")

    log.info(f"Loaded {len(documents)} pages with content")
    return documents

def chunk_documents(documents: List[Document]) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n", " ", ""],
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
    )

    log.info(f"Chunking {len(documents)} pages [size = {CHUNK_SIZE} , overlap = {CHUNK_OVERLAP}]")
    chunks = splitter.split_documents(documents)

    for i, chunk in enumerate(chunks):
        char_count = len(chunk.page_content)
        chunk.metadata["chunk_id"] = i
        chunk.metadata["char_count"] = char_count
        chunk.metadata["token_estimate"] = char_count // 4

    if not chunks:
        log.warning("No chunks created")
        return []

    avg = sum(c.metadata["char_count"] for c in chunks) // len(chunks)
    log.info(f"Created {len(chunks)} chunks ; avg chars : {avg}")
    return chunks

def load_and_chunk(pdf_path: str) -> List[Document]:
    pages = load_pdf(pdf_path)
    chunks = chunk_documents(pages)
    return chunks
