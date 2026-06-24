"""Chat API route — RAG-powered medical question answering."""

from flask import Blueprint, request, jsonify, g

from src.middleware import require_auth
from src.rag_chain import build_rag_chain, ask
from src.vectorstore import get_multi_query_retriever
from src.logger import get_logger

log = get_logger(__name__)

chat_bp = Blueprint("chat", __name__, url_prefix="/api")

# Lazy-loaded retriever — initialized on first request to avoid slow startup
# (embedding model download + Pinecone connection happens once)
_retriever = None


def _get_chain():
    """Build a RAG chain with a fresh BharatCode token.

    The retriever (Pinecone + embedding model) is cached because it is
    expensive to initialize.  The LLM / chain is rebuilt each time so
    that a current OAuth token is always used.
    """
    global _retriever

    if _retriever is None:
        log.info("Initializing retriever (first request)...")
        _retriever = get_multi_query_retriever()
        log.info("Retriever ready")

    chain = build_rag_chain(_retriever)
    return chain


@chat_bp.route("/chat", methods=["POST"])
@require_auth
def chat():
    """Process a medical question through the RAG pipeline.

    Headers: Authorization: Bearer <token>
    Body: { message: string }
    Returns: { answer: string, sources: [{title, page, excerpt, confidence}] }
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "Message is required"}), 400

    log.info(f"Chat request from user {g.user_email}: {message[:80]}")

    try:
        chain = _get_chain()
        result = ask(chain, message)

        # Format sources to match the frontend Source interface
        sources = []
        for i, src in enumerate(result.get("sources", [])):
            sources.append({
                "id": f"src-{i}",
                "title": "Gale Encyclopedia of Medicine",
                "page": f"Page {src.get('page', '?')}",
                "excerpt": src.get("preview", ""),
                "confidence": max(85, 99 - i * 3),  # Descending confidence based on retrieval rank
            })

        return jsonify({
            "answer": result["answer"],
            "sources": sources,
        }), 200

    except Exception as e:
        log.error(f"Chat error: {e}")
        return jsonify({
            "error": "Failed to process your question. Please try again.",
        }), 500
