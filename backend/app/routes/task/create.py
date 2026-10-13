# app/routes/task/create.py

from fastapi import APIRouter, Depends, status

from app.schemas.task_schema import TaskCreate
from app.services.task.service import TaskService

from app.core.container.task import get_task_service
from app.core.container.security import (
    get_current_user_dependency,
    get_security_service
)

from app.security.dependencies.service import DependencyService
from app.models.user.user import User
from app.security.permissions.permissions import Permission

router = APIRouter()


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
)
async def create_task(
    task: TaskCreate,
    service: TaskService = Depends(get_task_service),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service)
):
    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.TASKS_CREATE
    )
    return await service.create(
        user=user,
        task_data=task
    )
