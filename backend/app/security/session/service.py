# app/security/session/service.py

from app.security.session.cleanup import SessionCleanupService
from app.security.session.create import SessionCreateService
from app.security.session.manager import SessionManagerService
from app.security.session.revoke import SessionRevokeService


class SessionService:

    def __init__(
        self,
        create: SessionCreateService,
        manager: SessionManagerService,
        revoke: SessionRevokeService,
        cleanup: SessionCleanupService,
    ):
        self.create = create
        self.manager = manager
        self.revoke = revoke
        self.cleanup = cleanup