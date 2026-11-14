# app/routes/task/create.py

from fastapi import APIRouter, Depends, status, HTTPException

from app.schemas.task_schema import TaskCreate
from app.services.task.service import TaskService

from app.core.container.task import get_task_service
from app.core.container.security import (
    get_current_user_dependency,
    get_security_service,
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
    security: DependencyService = Depends(get_security_service),
):
    # 1. Enforce strict enterprise role-based access control clearance gates
    security.require_permission_dependency.require_permission(
        user=user, permission=Permission.TASKS_CREATE
    )

    # 🔒 ANTI-DUPLICATE SECURE GUARD GATE: Verify title existence against MongoDB shards
    task_exists = await service.check_task_title(task_title=task.title.strip())

    # ✅ FIXED LOGICAL INVERSION & INJECTED COMPLIANT 409 ERROR: Raise error ONLY if title is already persistent
    if task_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Operational Breach: A task operation node titled '{task.title.strip()}' already exists within this pipeline repository zone.",
        )

    # Dispatch the validated non-duplicate task packet down to the database persistence layer
    return await service.create(user=user, task_data=task)
