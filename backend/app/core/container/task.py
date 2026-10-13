# app/core/container/task.py

from app.services.task.service import TaskService


def get_task_service() -> TaskService:
    return TaskService()
