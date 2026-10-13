# app/routes/task/delete.py

from fastapi import APIRouter, status, Depends

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


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_200_OK
)
async def delete_task(
    task_id: str,
    service: TaskService = Depends(get_task_service),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service)
):
    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.TASKS_DELETE
    )
    return await service.delete(
        task_id=task_id,
        user=user
    )
