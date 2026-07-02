"""Chat API route — RAG-powered medical question answering."""

from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, g

from src.middleware import require_auth
from src.rag_chain import build_rag_chain, ask
from src.vectorstore import get_multi_query_retriever
from src.database import supabase
from src.logger import get_logger

log = get_logger(__name__)

chat_bp = Blueprint("chat", __name__, url_prefix="/api")

_retriever = None


def _get_chain():
    global _retriever

    if _retriever is None:
        log.info("Initializing retriever (first request)...")
        _retriever = get_multi_query_retriever()
        log.info("Retriever ready")

    chain = build_rag_chain(_retriever)
    return chain


@chat_bp.route("/chat/session", methods=["POST"])
@require_auth
def create_chat_session():
    try:
        session = (
            supabase
            .table("chat_sessions")
            .insert({
                "user_id": g.user_id,
                "title": "New Chat"
            })
            .execute()
        )

        session_id = session.data[0]["id"]

        log.info(
            f"New chat session created | user={g.user_email} | session={session_id}"
        )

        return jsonify({
            "session_id": session_id
        }), 201

    except Exception as e:
        log.error(f"Create session error: {e}")

        return jsonify({
            "error": "Failed to create chat session"
        }), 500


@chat_bp.route("/chat", methods=["POST"])
@require_auth
def chat():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    message = (data.get("message") or "").strip()
    session_id = data.get("session_id")

    if not message:
        return jsonify({"error": "Message is required"}), 400

    if not session_id:
        return jsonify({"error": "Session ID is required"}), 400

    log.info(
        f"Chat request | user={g.user_email} | session={session_id}"
    )

    try:
        existing = (
            supabase
            .table("chat_sessions")
            .select("*")
            .eq("id", session_id)
            .eq("user_id", g.user_id)
            .execute()
        )

        if not existing.data:
            return jsonify({
                "error": "Invalid session"
            }), 403

        (
            supabase
            .table("messages")
            .insert({
                "session_id": session_id,
                "role": "user",
                "content": message
            })
            .execute()
        )

        chain = _get_chain()

        start = datetime.now(timezone.utc)

        result = ask(chain, message)

        end = datetime.now(timezone.utc)

        duration_ms = int(
            (end - start).total_seconds() * 1000
        )

        sources = []

        for i, src in enumerate(result.get("sources", [])):
            sources.append({
                "id": f"src-{i}",
                "title": "Gale Encyclopedia of Medicine",
                "page": f"Page {src.get('page', '?')}",
                "excerpt": src.get("preview", ""),
                "confidence": max(85, 99 - i * 3),
            })

        (
            supabase
            .table("messages")
            .insert({
                "session_id": session_id,
                "role": "bot",
                "content": result["answer"],
                "sources": sources,
                "duration_ms": duration_ms
            })
            .execute()
        )

        (
            supabase
            .table("chat_sessions")
            .update({
                "updated_at": datetime.now(
                    timezone.utc
                ).isoformat()
            })
            .eq("id", session_id)
            .execute()
        )

        existing_session = existing.data[0]

        if existing_session["title"] == "New Chat":
            (
                supabase
                .table("chat_sessions")
                .update({
                    "title": (
                        message[:40] +
                        ("..." if len(message) > 40 else "")
                    )
                })
                .eq("id", session_id)
                .execute()
            )

        return jsonify({
            "answer": result["answer"],
            "sources": sources,
        }), 200

    except Exception as e:
        log.error(f"Chat error: {e}")

        return jsonify({
            "error": "Failed to process your question. Please try again."
        }), 500

@chat_bp.route("/chat/history", methods=["GET"])
@require_auth
def get_chat_history():
    try:
        sessions = (
            supabase
            .table("chat_sessions")
            .select("*")
            .eq("user_id", g.user_id)
            .order("updated_at", desc=True)
            .execute()
        )

        chats = []

        for session in sessions.data:
            chats.append({
                "id": session["id"],
                "title": session["title"],
                "createdAt": session["created_at"]
            })

        return jsonify({
            "chats": chats
        }), 200

    except Exception as e:
        log.error(f"History error: {e}")

        return jsonify({
            "error": "Failed to fetch chat history"
        }), 500

@chat_bp.route("/chat/session/<session_id>", methods=["GET"])
@require_auth
def get_chat_messages(session_id):
    try:
        session = (
            supabase
            .table("chat_sessions")
            .select("*")
            .eq("id", session_id)
            .eq("user_id", g.user_id)
            .execute()
        )

        if not session.data:
            return jsonify({
                "error": "Session not found"
            }), 404

        messages = (
            supabase
            .table("messages")
            .select("*")
            .eq("session_id", session_id)
            .order("created_at")
            .execute()
        )

        formatted = []

        for msg in messages.data:
            formatted.append({
                "id": msg["id"],
                "role": "assistant" if msg["role"] == "bot" else "user",
                "content": msg["content"],
                "sources": msg["sources"],
                "timestamp": msg["created_at"]
            })

        return jsonify({
            "messages": formatted
        }), 200

    except Exception as e:
        log.error(f"Load session error: {e}")

        return jsonify({
            "error": "Failed to load chat"
        }), 500