# app/core/container/security_attempts.py

from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.services.security.security_attempts.create import (
    SecurityAttemptsServiceCreate
)
from app.services.security.security_attempts.read import (
    SecurityAttemptsServiceRead
)
from app.services.security.security_attempts.update import (
    SecurityAttemptsServiceUpdate
)
from app.services.security.security_attempts.deactivate import (
    SecurityAttemptsServiceDeactivate
)


from app.repositories.security.security_attempts.repository import (
    SecurityAttemptsRepository
)
from app.repositories.security.security_attempts.create import (
    SecurityAttemptsRepositoryCreate
)
from app.repositories.security.security_attempts.read import (
    SecurityAttemptsRepositoryRead
)
from app.repositories.security.security_attempts.update import (
    SecurityAttemptsRepositoryUpdate
)
from app.repositories.security.security_attempts.deactivate import (
    SecurityAttemptsRepositoryDeactivate
)

from app.security.security_attempts.service import (
    SecurityAttemptsService as SecurityAttemptsServiceForDecision
)
from app.security.security_attempts.decision import (
    SecurityAttemptsDecision
)

from app.security.security_attempts.checker import (
    SecurityAttemptsChecker
)
from app.security.security_attempts.policy import (
    SecurityAttemptsPolicy
)


def get_security_attempts_service() -> SecurityAttemptsService:

    repository = SecurityAttemptsRepository(
        repository_create=SecurityAttemptsRepositoryCreate(),
        repository_read=SecurityAttemptsRepositoryRead(),
        repository_update=SecurityAttemptsRepositoryUpdate(),
        repository_deactivate=SecurityAttemptsRepositoryDeactivate()
    )
    return SecurityAttemptsService(
        create=SecurityAttemptsServiceCreate(
            repository=repository
        ),
        read=SecurityAttemptsServiceRead(
            repository=repository
        ),
        update=SecurityAttemptsServiceUpdate(
            repository=repository
        ),
        deactivate=SecurityAttemptsServiceDeactivate(
            repository=repository
        )

    )


def get_security_attempts_security_service() -> SecurityAttemptsServiceForDecision:

    return SecurityAttemptsServiceForDecision(
        decision=SecurityAttemptsDecision(
            checker=SecurityAttemptsChecker(),
        ),
        policy=SecurityAttemptsPolicy()
    )
