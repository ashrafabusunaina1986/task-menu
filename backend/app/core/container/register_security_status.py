# app/core/container/register_security_status.py

from app.services.security.security_status.register.service import (
    RegisterSecurityStatusService
)

from app.repositories.security.security_status.register.read import (
    RegisterSecurityStatusRepositoryRead
)

from app.repositories.security.security_status.register.create import (
    RegisterSecurityStatusRepositoryCreate
)


def get_register_security_status_service() -> RegisterSecurityStatusService:
    return RegisterSecurityStatusService(
        service_create=RegisterSecurityStatusRepositoryCreate(),
        service_read=RegisterSecurityStatusRepositoryRead()
    )
