# app/security/security_attempts/service.py

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)


from app.security.security_attempts.decision import (
    SecurityAttemptsDecision
)
from app.security.security_attempts.policy import (
    SecurityAttemptsPolicy
)
from app.schemas.security.security_attempts.base import (
    SecurityOperation,
)


class SecurityAttemptsService:

    def __init__(
        self,
        decision: SecurityAttemptsDecision,
        policy: SecurityAttemptsPolicy
    ):
        self.decision = decision
        self.policy = policy

    def should_block(
        self,
        security_attempts: SecurityAttemptsModel
    ) -> bool:

        return self.decision.should_block(
            security_attempts=security_attempts
        )

    def is_within_time_window(
        self,
        security_attempts: SecurityAttemptsModel,
        minutes: int
    ) -> bool:
        return self.decision.checker.is_within_time_window(
            security_attempts=security_attempts,
            minutes=minutes
        )

    def max_attempts(
        self,
        operation: SecurityOperation
    ) -> int:
        return self.policy.max_attempts(
            operation=operation
        )
