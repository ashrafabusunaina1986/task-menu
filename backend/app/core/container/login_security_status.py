# app/core/container/login_security_status.py

from app.services.security.security_status.login.service import (
    LoginSecurityStatusService
)

from app.repositories.security.security_status.login.read import (
    LoginSecurityStatusRepositoryRead
)

from app.repositories.security.security_status.login.create import (
    LoginSecurityStatusRepositoryCreate
)


def get_login_security_status_service() -> LoginSecurityStatusService:
    return LoginSecurityStatusService(
        create=LoginSecurityStatusRepositoryCreate(),
        read=LoginSecurityStatusRepositoryRead()
    )
