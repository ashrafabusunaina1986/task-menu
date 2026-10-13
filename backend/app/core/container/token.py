# app/core/container/token.py

from app.security.token.service import TokenService
from app.core.config import settings


def get_token_service() -> TokenService:
    return TokenService(
        secret_key=settings.JWT_SECRET_KEY
    )