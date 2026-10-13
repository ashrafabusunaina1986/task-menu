# app/security/otp/hasher.py

import hashlib
import hmac

from pydantic import SecretStr

from app.core.config import settings


class OTPHasher:
    secret:SecretStr = settings.OTP_SECRET

    @classmethod
    def hash(
        cls,
        otp: str
    ) -> str:
        return hmac.new(
            cls.secret.get_secret_value().encode(),
            otp.encode(),
            hashlib.sha256
        ).hexdigest()
