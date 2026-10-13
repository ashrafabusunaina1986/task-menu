# app/security/recaptcha/service.py

from app.security.recaptcha.verifier import RecaptchaVerifier


class RecaptchaService:
    def __init__(
        self,
        recaptcha_verifier_service: RecaptchaVerifier
    ):
        self.recaptcha_verifier_service = recaptcha_verifier_service

    async def verify(
        self,
        token: str,
        expected_action: str
    ) -> bool:
        result = await self.recaptcha_verifier_service.verify(
            token=token
        )

        if not result.get("success"):
            return False

        if result.get("action") != expected_action:
            return False

        score = result.get("score", 0)

        if score < 0.5:
            return False
        return True
