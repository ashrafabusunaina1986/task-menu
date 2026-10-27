# app/core/container/project/project.py

from fastapi import Depends

from app.security.dependencies.service import DependencyService
from app.models.user.user import User

from app.services.project.service import ProjectService
from app.services.project.create import ProjectServiceCreate
from app.services.project.read import ProjectServiceRead
from app.services.project.update import ProjectServiceUpdate
from app.services.project.delete import ProjectServiceDelete

from app.services.task.delete import TaskDeleteService

from app.repositories.project.create import ProjectRepositoryCreate
from app.repositories.project.read import ProjectRepositoryRead
from app.repositories.project.update import ProjectRepositoryUpdate
from app.repositories.project.delete import ProjectRepositoryDelete

from app.core.container.security import get_security_service, get_current_user_dependency


def get_project_service_read(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service)
) -> ProjectServiceRead:
    return ProjectServiceRead(
        repository_read=ProjectRepositoryRead(),
        user=user,
        security=security
    )


def get_project_service_create(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service)
) -> ProjectServiceCreate:
    return ProjectServiceCreate(
        repository_create=ProjectRepositoryCreate(),
        user=user,
        security=security
    )


def get_project_service_update(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service)
) -> ProjectServiceUpdate:
    return ProjectServiceUpdate(
        repository_update=ProjectRepositoryUpdate(),
        user=user,
        security=security
    )


def get_project_service_delete(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    read: ProjectServiceRead = Depends(get_project_service_read)
) -> ProjectServiceDelete:
    return ProjectServiceDelete(
        service_project=read,
        service_task=TaskDeleteService(
            project_service_read=read
        ),
        repository_delete=ProjectRepositoryDelete(),
        user=user,
        security=security,
    )


def get_project_service(
    update: ProjectServiceUpdate = Depends(get_project_service_update),
    create: ProjectServiceCreate = Depends(get_project_service_create),
    read: ProjectServiceRead = Depends(get_project_service_read),
    delete: ProjectServiceDelete = Depends(get_project_service_delete)
) -> ProjectService:

    return ProjectService(
        service_update=update,
        service_read=read,
        service_create=create,
        service_delete=delete
    )
