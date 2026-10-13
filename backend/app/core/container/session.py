# app/core/container/session.py

from fastapi import Depends

from app.security.session.service import SessionService

from app.core.container.session_parts import (
    get_session_create_service,
    get_session_manager_service,
    get_session_revoke_service,
    get_session_cleanup_service,
)


def get_session_service(
    create = Depends(get_session_create_service),
    manager = Depends(get_session_manager_service),
    revoke = Depends(get_session_revoke_service),
    cleanup = Depends(get_session_cleanup_service),
) -> SessionService:

    return SessionService(
        create=create,
        manager=manager,
        revoke=revoke,
        cleanup=cleanup,
    )