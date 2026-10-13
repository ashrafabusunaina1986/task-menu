# app/core/container/session_parts.py

from fastapi import Depends

from app.security.session.create import SessionCreateService
from app.security.session.manager import SessionManagerService
from app.security.session.revoke import SessionRevokeService
from app.security.session.cleanup import SessionCleanupService

from app.services.session.service import (
    SessionService as SessionDBService
)

from app.repositories.session.repository import SessionRepository


def get_session_db_service() -> SessionDBService:
    return SessionDBService(
        repository=SessionRepository()
    )


def get_session_create_service(
    session_service: SessionDBService = Depends(
        get_session_db_service
    )
):
    return SessionCreateService(
        session_service=session_service
    )


def get_session_manager_service(
    session_service: SessionDBService = Depends(
        get_session_db_service
    )
):
    return SessionManagerService(
        session_service=session_service
    )


def get_session_revoke_service(
    session_service: SessionDBService = Depends(
        get_session_db_service
    )
):
    return SessionRevokeService(
        session_service=session_service
    )


def get_session_cleanup_service(
    session_service: SessionDBService = Depends(
        get_session_db_service
    )
):
    return SessionCleanupService(
        session_service=session_service
    )
