# app/core.container/google_auth.py
from fastapi import Depends

from app.security.auth.google import GoogleAuthService
from app.security.token.google_verifier import GoogleTokenVerifier

from app.core.container.user import get_user_service
from app.core.container.google_user import get_google_user_create_service
from app.core.container.token import get_token_service
from app.core.container.session import get_session_service
from app.core.container.user_block import get_user_block_service


def get_google_auth_service(
    user_service=Depends(get_user_service),
    google_user_create_service=Depends(get_google_user_create_service),
    token_service=Depends(get_token_service),
    session_service=Depends(get_session_service),
    user_block_service=Depends(get_user_block_service)
) -> GoogleAuthService:
    return GoogleAuthService(
        user_service=user_service,
        google_user_create_service=google_user_create_service,
        google_token_verifier=GoogleTokenVerifier(),
        token_service=token_service,
        session_service=session_service,
        user_block_service=user_block_service
    )
