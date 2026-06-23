"""JWT authentication middleware for Flask routes."""

from functools import wraps

from flask import request, jsonify, g

from src.auth import verify_token
from src.logger import get_logger

log = get_logger(__name__)


def require_auth(f):
    """Decorator that enforces JWT authentication on a route.

    Extracts the Bearer token from the Authorization header,
    verifies it, and sets g.user_id / g.user_email on the
    Flask request context. Returns 401 on failure.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or malformed Authorization header"}), 401

        token = auth_header[7:]  # strip "Bearer "

        result = verify_token(token)

        if not result["valid"]:
            log.warning(f"Auth failed: {result.get('error', 'unknown')}")
            return jsonify({"error": result.get("error", "Authentication failed")}), 401

        # Attach user info to Flask request context
        g.user_id = result["user_id"]
        g.user_email = result["email"]

        return f(*args, **kwargs)

    return decorated
