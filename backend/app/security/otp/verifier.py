# app/security/otp/verifier.py

import hmac

from app.security.otp.hasher import OTPHasher


class OTPVerifier:

    @classmethod
    def verify(
        cls,
        otp: str,
        otp_hash: str
    ) -> bool:
        generated_hash = OTPHasher.hash(
            otp
        )

        return hmac.compare_digest(
            generated_hash, otp_hash
        )
