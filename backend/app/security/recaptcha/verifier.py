# app/security/recaptcha/verifier.py

import httpx


class RecaptchaVerifier:
    VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

    def __init__(
        self,
        secret_key: str,
    ):
        self.secret_key = secret_key

    async def verify(
        self,
        token,
    ) -> dict:

        async with httpx.AsyncClient() as client:

            response = await client.post(
                self.VERIFY_URL,
                data={
                    "secret": self.secret_key,
                    "response": token
                },
                timeout=10.0,
            )
            response.raise_for_status()

            return response.json()
