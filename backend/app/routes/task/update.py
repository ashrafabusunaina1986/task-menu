# app/routes/task/update.py

from fastapi import APIRouter, Depends

from app.schemas.task_schema import TaskUpdate
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


@router.put("/{task_id}")
async def update_task(
    task_id: str,
    project_id: str,
    task: TaskUpdate,
    service: TaskService = Depends(get_task_service),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service)
):
    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.TASKS_UPDATE
    )
    return await service.update(
        task_id=task_id,
        user=user,
        data=task.model_dump(
            exclude_none=True
        ),
        project_id=project_id
    )
