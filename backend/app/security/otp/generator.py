# app/security/otp/generator.py

import secrets

from app.security.constants import OTP_LENGTH


class OTPGenerator:

    otp_length = OTP_LENGTH

    @classmethod
    def generate(cls) -> str:
        return "".join(
            secrets.choice("0123456789")
            for _ in range(cls.otp_length)
        )
