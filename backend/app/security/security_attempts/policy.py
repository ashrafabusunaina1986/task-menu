# app/security/security_attempts/policy.py

from app.schemas.security.security_attempts.base import (
    SecurityMaxAttempts,
    SecurityOperation
)


class SecurityAttemptsPolicy:

    @staticmethod
    def max_attempts(
        operation: SecurityOperation
    ) -> int:
        return SecurityMaxAttempts[
            operation.name
        ].value
