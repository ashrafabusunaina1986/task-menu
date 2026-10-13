# app/core/container/logout.py

from app.security.auth.logout import LogoutService
from app.security.session.service import (
    SessionService as SecuritySessionService
)
from app.services.session.service import (
    SessionService as BaseSessionService
)

from app.security.session.cleanup import SessionCleanupService
from app.security.session.manager import SessionManagerService
from app.security.session.create import SessionCreateService
from app.security.session.revoke import SessionRevokeService

from app.repositories.session.repository import SessionRepository

from app.core.container.user import get_user_service


def get_logout_service() -> LogoutService:

    user_service = get_user_service()

    base_session_service = BaseSessionService(
        repository=SessionRepository()
    )

    session_create = SessionCreateService(
        session_service=base_session_service
    )
    session_revoke = SessionRevokeService(
        session_service=base_session_service
    )
    session_cleanup = SessionCleanupService(
        session_service=base_session_service
    )
    session_manager = SessionManagerService(
        session_service=base_session_service
    )

    security_session_service = SecuritySessionService(
        create=session_create,
        cleanup=session_cleanup,
        revoke=session_revoke,
        manager=session_manager
    )

    return LogoutService(
        session_service=security_session_service,
        user_service=user_service
    )
