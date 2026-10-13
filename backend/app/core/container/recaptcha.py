# app/core/container/recaptcha.py

from fastapi import Depends

from app.security.recaptcha.verifier import RecaptchaVerifier
from app.security.recaptcha.service import RecaptchaService

from app.core.config import settings


def get_recaptcha_verifier() -> RecaptchaVerifier:
    return RecaptchaVerifier(
        secret_key=settings.RECAPTCHA_SECRET_KEY
    )


def get_recaptcha_service(
    recaptcha_verifier: RecaptchaVerifier = Depends(
        get_recaptcha_verifier
    )
) -> RecaptchaService:
    return RecaptchaService(
        recaptcha_verifier_service=recaptcha_verifier
    )
