"""Authentication API routes — register and login."""

from flask import Blueprint, request, jsonify

from src.auth import register_user, login_user
from src.logger import get_logger

log = get_logger(__name__)

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user.

    Body: { email, password, full_name }
    Returns: { success, token, user } or { error }
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = (data.get("email") or "").strip()
    password = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip()

    # Validate required fields
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400
    if not full_name:
        return jsonify({"error": "Full name is required"}), 400

    try:
        result = register_user(email, password, full_name)

        if not result["success"]:
            return jsonify({"error": result["error"]}), 409

        return jsonify({
            "success": True,
            "token": result["token"],
            "user": result["user"],
        }), 201

    except Exception as e:
        log.error(f"Registration error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Log in an existing user.

    Body: { email, password }
    Returns: { success, token, user } or { error }
    """
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    try:
        result = login_user(email, password)

        if not result["success"]:
            return jsonify({"error": result["error"]}), 401

        return jsonify({
            "success": True,
            "token": result["token"],
            "user": result["user"],
        }), 200

    except Exception as e:
        log.error(f"Login error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
