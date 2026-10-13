# app/core/container/pending_registration.py

from app.services.user.pending_registration.service import PendingRegisterService

from app.services.user.pending_registration.create import PendingRegisterServiceCreate
from app.services.user.pending_registration.read import PendingRegisterServiceRead

from app.services.user.pending_registration.delete import PendingRegisterServicesDelete
from app.repositories.user.pending_registration.repository import PendingRegisterRepository
from app.repositories.user.pending_registration.create import PendingRegisterRepositoryCreate
from app.repositories.user.pending_registration.read import PendingRegisterRepositoryRead

from app.repositories.user.pending_registration.delete import PendingRegisterRepositoryDelete

from app.security.password.hasher import PasswordHasher


def get_pending_register_service() -> PendingRegisterService:

    repository = PendingRegisterRepository(
        create=PendingRegisterRepositoryCreate(),
        read=PendingRegisterRepositoryRead(),
        delete=PendingRegisterRepositoryDelete()
    )

    return PendingRegisterService(
        service_read=PendingRegisterServiceRead(
            repository=repository
        ),
        service_create=PendingRegisterServiceCreate(
            repository=repository,
            hasher=PasswordHasher()
        ),
        service_delete=PendingRegisterServicesDelete(
            delete=PendingRegisterRepositoryDelete()
        )
    )
