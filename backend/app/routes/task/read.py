# app/routes/task/read.py

from fastapi import APIRouter,Depends

from app.schemas.task_schema import TaskResponse
from app.services.task.service import TaskService
from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService
from app.models.user.user import User

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency
)
from app.core.container.task import get_task_service

router = APIRouter()


@router.get(
    "/",
    response_model=list[TaskResponse]
)
async def get_tasks(
    service: TaskService = Depends(get_task_service),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service)
):
    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.TASKS_READ
    )
    return await service.get_all(
        user=user
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
async def get_task(
    task_id: str,
    service: TaskService = Depends(get_task_service),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service)
):
    security.require_permission_dependency.require_permission(
          user=user,
          permission=Permission.TASKS_READ
    )  
    return await service.get_by_id(
        task_id=task_id,
        user=user
    )