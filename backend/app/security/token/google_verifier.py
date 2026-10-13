# app/security/auth/google_verifier.py

from google.oauth2 import id_token
from google.auth.transport import requests

from app.core.config import settings


class GoogleTokenVerifier:

    def verify(
        self,
        token: str
    ) -> dict:
        payload = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

        if not payload.get("email_verified"):
            raise ValueError(
                "Google email not verified"
            )

        return payload
