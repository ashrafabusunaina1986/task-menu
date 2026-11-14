# app/routes/task/read.py

from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.schemas.task_schema import TaskResponse
from app.services.task.service import TaskService
from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService
from app.models.user.user import User

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)
from app.core.container.task import get_task_service

router = APIRouter()


@router.get("/", response_model=list[TaskResponse])
async def get_tasks(
    project_id: str,
    service: TaskService = Depends(get_task_service),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
):
    """
    Exposes an isolated database routing channel to query and pull tasks metadata clusters.
    Enforces active permission checking and delegates operational queries based on user roles.
    """
    # 1. Access Validation Gate: Enforce global permission matrix reading permissions
    security.require_permission_dependency.require_permission(
        user=user, permission=Permission.TASKS_READ
    )

    # 2. Pipeline Delegation: Forward execution down to the service validation layers
    return await service.get_all(user=user, project_id=project_id)


@router.get("/task", response_model=TaskResponse)
async def get_task(
    task_id: str,
    project_id: str,
    service: TaskService = Depends(get_task_service),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
):
    security.require_permission_dependency.require_permission(
        user=user, permission=Permission.TASKS_READ
    )
    return await service.get_by_id(task_id=task_id, user=user, project_id=project_id)


@router.get("/check-title", response_model=bool, status_code=status.HTTP_200_OK)
async def check_task_title(
    task_title: str = Query(
        ...,
        description="The dynamic task operation title string to verify unique bounds",
    ),
    service: TaskService = Depends(
        get_task_service
    ),  # Synced database gateway dependency injector
):
    """
    Dynamic operational endpoint verifying task title uniqueness constraints.
    Returns True if a duplicate entry is localized, and False if the identifier is fully available.
    """
    # 🔒 ANTI-DUPLICATE SECURE GUARD GATE: Invoke the internal service layer to inspect database records
    # Strip unnecessary blank whitespaces to prevent bypass hacks
    task_exists = await service.check_task_title(task_title=task_title.strip())

    # ✅ FIXED LOGICAL INVERSION & ELIMINATED 409 BLOCK: Return clear boolean values cleanly without throwing raw HTTP errors
    if task_exists:
        # Returns True to inform the frontend Zod scheme that a duplicate exists, triggering the validation block
        return True

    # Returns False to inform the frontend Zod framework that the title path is free and clear for deployment
    return False
