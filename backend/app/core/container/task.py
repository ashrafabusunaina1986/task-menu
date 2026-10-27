# app/core/container/task.py
from fastapi import Depends

from app.services.task.service import TaskService
from app.services.project.read import ProjectServiceRead
from app.core.container.project.project import get_project_service_read


def get_task_service(
    project_service_read: ProjectServiceRead = Depends(
        get_project_service_read
    )
) -> TaskService:
    return TaskService(
        project_service_read=project_service_read
    )
