import sys
import bcrypt
import jwt
import requests

from datetime import datetime, timezone, timedelta
from pathlib import Path
from supabase import create_client

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from config import (
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    JWT_SECRET,
    JWT_EXPIRY_HOURS
)

from src.logger import get_logger


log = get_logger(__name__)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        password.encode(),
        hashed.encode()
    )


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "exp": int(
            (
                datetime.now(timezone.utc)
                + timedelta(hours=JWT_EXPIRY_HOURS)
            ).timestamp()
        )
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm="HS256"
    )


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        return {
            "valid": True,
            "user_id": payload["sub"],
            "email": payload["email"]
        }

    except jwt.ExpiredSignatureError:
        return {
            "valid": False,
            "error": "Token Expired"
        }

    except jwt.InvalidTokenError:
        return {
            "valid": False,
            "error": "Invalid Token"
        }


def register_user(email: str, password: str, full_name: str) -> dict:
    log.info(f"Register Attempt: {email}")

    existing = (
        supabase
        .table("users")
        .select("id")
        .eq("email", email)
        .execute()
    )

    if existing.data:
        log.warning(f"Register Failed - Email Exists: {email}")

        return {
            "success": False,
            "error": "Email already registered"
        }

    if len(password) < 8:
        return {
            "success": False,
            "error": "Password must be at least 8 characters"
        }

    password_hash = hash_password(password)

    user = (
        supabase
        .table("users")
        .insert({
            "email": email,
            "password_hash": password_hash,
            "full_name": full_name
        })
        .execute()
    )

    user_data = user.data[0]
    token = create_token(user_data["id"], email)

    log.info(f"User Registered: {email}")

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user_data["id"],
            "email": email,
            "full_name": full_name
        }
    }


def login_user(email: str, password: str) -> dict:
    log.info(f"Login Attempt: {email}")

    result = (
        supabase
        .table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if not result.data:
        log.warning(f"Login Failed - User Not Found: {email}")

        return {
            "success": False,
            "error": "Invalid email or password"
        }

    user = result.data[0]

    if user["password_hash"] is None:
        return {
            "success": False,
            "error": "This account uses Google Sign-In"
        }

    if not verify_password(password, user["password_hash"]):
        log.warning(f"Login Failed - Wrong Password: {email}")

        return {
            "success": False,
            "error": "Invalid email or password"
        }

    (
        supabase
        .table("users")
        .update({
            "last_login": datetime.now(timezone.utc).isoformat()
        })
        .eq("id", user["id"])
        .execute()
    )

    token = create_token(user["id"], email)

    log.info(f"Login Success: {email}")

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"]
        }
    }


def google_login_user(access_token: str) -> dict:
    
    log.info("Google Login Attempt")
    
    try:
        google_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )

        if google_response.status_code != 200:
            
            log.warning("Google Authentication Failed - Invalid Token")
            
            return {
                "success": False,
                "error": "Google authentication failed"
            }

        google_data = google_response.json()

        email = google_data["email"]
        full_name = google_data.get("name", "Google User")
        log.info(f"Google Account Verified: {email}")

        result = (
            supabase
            .table("users")
            .select("*")
            .eq("email", email)
            .execute()
        )

        log.info(f"Checking if Google user exists: {email}")
        
        if result.data:
            user = result.data[0]

            (
                supabase
                .table("users")
                .update({
                    "last_login": datetime.now(timezone.utc).isoformat()
                })
                .eq("id", user["id"])
                .execute()
            )

            token = create_token(user["id"], email)
            
            log.info(f"Google Login Success (Existing User): {email}")
            
            return {
                "success": True,
                "token": token,
                "user": {
                    "id": user["id"],
                    "email": email,
                    "full_name": user["full_name"]
                }
            }

        user = (
            supabase
            .table("users")
            .insert({
                "email": email,
                "password_hash": None,
                "full_name": full_name
            })
            .execute()
        )

        user_data = user.data[0]
        token = create_token(user_data["id"], email)
        
        log.info(f"Google User Registered: {email}")
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user_data["id"],
                "email": email,
                "full_name": full_name
            }
        }

    except Exception as e:
        log.error(f"Google Login Failed: {e}")

        return {
            "success": False,
            "error": "Google authentication failed"
        }