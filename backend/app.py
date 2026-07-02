"""MedBot AI — Flask API Server.

Exposes authentication and RAG-powered chat endpoints.
Run with: python app.py
"""

import sys
from pathlib import Path

# Ensure the backend root is on sys.path so `from config import ...` works
sys.path.insert(0, str(Path(__file__).resolve().parent))

from flask import Flask, jsonify
from flask_cors import CORS

from config import FLASK_PORT, FLASK_DEBUG, FLASK_SECRET_KEY
from src.logger import get_logger
from src.routes.auth_routes import auth_bp
from src.routes.chat_routes import chat_bp

log = get_logger(__name__)


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = FLASK_SECRET_KEY

    # CORS — allow the Next.js dev server
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ],
            "methods": ["GET", "POST", "DELETE" , "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
        }
    })

    # ── Register Blueprints ──
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)

    # ── Health Check ──
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "medbot-api"}), 200

    # ── Error Handlers ──
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Unauthorized"}), 401

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        log.error(f"Internal server error: {e}")
        return jsonify({"error": "Internal server error"}), 500

    log.info(f"MedBot API initialized | port={FLASK_PORT} | debug={FLASK_DEBUG}")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host="0.0.0.0",
        port=FLASK_PORT,
        debug=FLASK_DEBUG,
    )
