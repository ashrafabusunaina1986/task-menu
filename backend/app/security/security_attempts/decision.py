# app/security/security_attempts/decision.py

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)

from app.security.security_attempts.checker import (
    SecurityAttemptsChecker
)


class SecurityAttemptsDecision:

    def __init__(
        self,
        checker: SecurityAttemptsChecker
    ):
        self.checker = checker

    def should_block(
        self,
        security_attempts: SecurityAttemptsModel
    ) -> bool:

        if not self.checker.is_current(
            security_attempts=security_attempts
        ):
            return False

        if self.checker.is_blocked(
            security_attempts=security_attempts
        ):
            return True

        return self.checker.is_max_attempts(
            security_attempts=security_attempts
        )
