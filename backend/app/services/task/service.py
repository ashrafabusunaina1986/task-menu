# app/services/task/service.py

from app.services.task.create import TaskCreateService
from app.services.task.read import TaskReadService
from app.services.task.update import TaskUpdateService
from app.services.task.delete import TaskDeleteService


class TaskService(
    TaskCreateService,
    TaskReadService,
    TaskUpdateService,
    TaskDeleteService
):
    pass