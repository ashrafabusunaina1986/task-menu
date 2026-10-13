# app/services/session/service.py

from app.services.session.create import SessionCreateService
from app.services.session.delete import SessionDeleteService
from app.services.session.update import SessionUpdateService
from app.services.session.read import SessionReadService
from app.services.session.cleanup import SessionCleanupService


class SessionService(
    SessionReadService,
    SessionUpdateService,
    SessionDeleteService,
    SessionCreateService,
    SessionCleanupService
):

    pass
