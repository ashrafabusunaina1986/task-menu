# app/core/container/team/team.py

from fastapi import Depends

from app.services.team.team.service import TeamService
from app.services.team.team.create import TeamServiceCreate
from app.services.team.team.read import TeamServiceRead
from app.services.team.team.update import TeamServiceUpdate
from app.services.team.team.delete import TeamServiceDelete

from app.security.dependencies.service import DependencyService
from app.models.user.user import User

from app.repositories.team.team.repository import TeamRepository
from app.repositories.team.team.create import TeamRepositoryCreate
from app.repositories.team.team.read import TeamRepositoryRead
from app.repositories.team.team.update import TeamRepositoryUpdate
from app.repositories.team.team.delete import TeamRepositoryDelete

from app.core.container.security import (
    get_current_user_dependency,
    get_security_service,
)


def get_repository() -> TeamRepository:
    return TeamRepository(
        create=TeamRepositoryCreate(),
        read=TeamRepositoryRead(),
        update=TeamRepositoryUpdate(),
        delete=TeamRepositoryDelete(),
    )


# CREATE
def get_team_create_service(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamServiceCreate:
    return TeamServiceCreate(user=user, security=security, repository=get_repository())


# READ
def get_team_read_service(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamServiceRead:
    return TeamServiceRead(user=user, security=security, repository=get_repository())


# UPDATE
def get_team_update_service(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamServiceUpdate:
    return TeamServiceUpdate(user=user, security=security, repository=get_repository())


# DELETE
def get_team_delete_service(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamServiceDelete:
    return TeamServiceDelete(user=user, security=security, repository=get_repository())


# =============== TEAM SERVICE ====================
def get_team_service(
    create: TeamServiceCreate = Depends(get_team_create_service),
    read: TeamServiceRead = Depends(get_team_read_service),
    update: TeamServiceUpdate = Depends(get_team_update_service),
    delete: TeamServiceDelete = Depends(get_team_delete_service),
) -> TeamService:

    return TeamService(create=create, read=read, update=update, delete=delete)
