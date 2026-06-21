import os 
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / '.env')


class _LazySecret:
    """Descriptor that defers env-var validation until first access."""

    def __init__(self, key: str):
        self.key = key
        self._value: str | None = None

    def __set_name__(self, owner, name):
        self.attr = name

    def __get__(self, obj, objtype=None) -> str:
        if self._value is None:
            val = os.getenv(self.key)
            if not val:
                raise EnvironmentError(
                    f"\n❌ Missing required env variable: '{self.key}'"
                    f"\n   -> Copy .env.example to .env and fill in your values."
                )
            self._value = val
        return self._value


class _Config:
    """Central configuration – secrets are validated lazily on first access."""

    # ── Lazy secrets (only checked when you actually use them) ──
    OPENAI_API_KEY   = _LazySecret("OPENAI_API_KEY")
    PINECONE_API_KEY = _LazySecret("PINECONE_API_KEY")
    SUPABASE_URL     = _LazySecret("SUPABASE_URL")
    SUPABASE_SERVICE_KEY = _LazySecret("SUPABASE_SERVICE_KEY")
    JWT_SECRET       = _LazySecret("JWT_SECRET")


_cfg = _Config()

# ── Re-export lazy secrets so `from config import X` still works ──
# Accessing these names at module level returns the descriptor holder;
# the actual validation happens when the VALUE is read at runtime.
# We use a thin property-style wrapper via __getattr__ at module level.

PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "medbot-gale")
PINECONE_ENVIRONMENT: str = os.getenv("PINECONE_ENVIRONMENT" , "us-east-1")

OPENAI_API_BASE: str = os.getenv("OPENAI_API_BASE", "https://bharatcode.ai/api/model/v1")
OPENAI_LLM_MODEL: str = os.getenv("OPENAI_LLM_MODEL", "bharatcode:qwen36-35b-q6-256k-vision")
OPENAI_EMBEDDING_MODEL: str = os.getenv("OPENAI_EMBEDDING_MODEL", "BAAI/bge-base-en-v1.5")
EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "768"))

CHUNK_SIZE: int = int( os.getenv("CHUNK_SIZE", "650"))
CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "120"))

FLASK_ENV: str = os.getenv("FLASK_ENV", "development")
FLASK_SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "dev-secret")
FLASK_PORT: int = int(os.getenv("FLASK_PORT", "5000"))
FLASK_DEBUG: bool = FLASK_ENV == "development"

LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
LOG_DIR: Path = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)

DATA_DIR: Path = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

RETRIEVER_TOP_K: int = int(os.getenv("RETRIEVER_TOP_K", "5"))
MAX_TOKENS_RESPONSE: int = int(os.getenv("MAX_TOKENS_RESPONSE", "1024"))
LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.3"))

SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY","")

JWT_EXPIRY_HOURS: int = int(os.getenv("JWT_EXPIRY_HOURS", "24"))

# ── Module-level __getattr__ for lazy secrets ──
# When someone does `from config import OPENAI_API_KEY`, Python will call
# this function because OPENAI_API_KEY is not a plain module-level variable.
_LAZY_SECRETS = {
    "OPENAI_API_KEY",
    "PINECONE_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_KEY",
    "JWT_SECRET",
}

def __getattr__(name: str):
    if name in _LAZY_SECRETS:
        return getattr(_cfg, name)
    raise AttributeError(f"module 'config' has no attribute {name!r}")
