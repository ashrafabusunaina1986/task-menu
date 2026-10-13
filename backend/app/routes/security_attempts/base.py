# app/routes/security_attempts/base.py

from app.core.container.security_attempts import (
    get_security_attempts_service
)


class SecurityAttemptsRouteBase:

    @property
    def get_service(self):
        return get_security_attempts_service

    @property
    def get_prefix(self):
        return "/security-attempts"

    @property
    def tags(self):
        return ["Security Attempts"]
