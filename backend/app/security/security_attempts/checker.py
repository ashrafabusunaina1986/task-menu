# app/security/security_attempts/checker.py

from datetime import datetime, timezone, timedelta

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)


class SecurityAttemptsChecker:

    def is_max_attempts(
        self,
        security_attempts: SecurityAttemptsModel
    ) -> bool:
        return (
            security_attempts.attempts
            >= security_attempts.max_attempts
        )

    def is_blocked(
        self,
        security_attempts: SecurityAttemptsModel
    ) -> bool:
        return security_attempts.is_blocked

    def is_current(
        self,
        security_attempts: SecurityAttemptsModel
    ) -> bool:
        return security_attempts.is_current

    def is_within_time_window(
        self,
        security_attempts: SecurityAttemptsModel,
        minutes: int
    ) -> bool:

        if security_attempts.last_attempt_at is None:
            return False

        now = datetime.now(timezone.utc)

        time_limit = now-timedelta(
            minutes=minutes
        )

        return security_attempts.last_attempt_at >= time_limit
