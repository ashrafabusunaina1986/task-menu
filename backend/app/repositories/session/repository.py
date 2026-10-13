# app/repositories/session.repository.py

from app.repositories.session import (
    create,
    delete,
    update,
    read,
    cleanup
)


class SessionRepository(
    create.SessionCreateRepository,
    read.SessionReadRepository,
    update.SessionUpdateRepository,
    delete.SessionDeleteRepository,
    cleanup.SessionCleanupRepository
):
    pass
