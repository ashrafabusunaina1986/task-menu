# app/repositories/task/repository.py

from app.repositories.task.create import TaskCreateRepository
from app.repositories.task.read import TaskReadRepository
from app.repositories.task.update import TaskUpdateRepository
from app.repositories.task.delete import TaskDeleteRepository


class TaskRepository(
    TaskCreateRepository,
    TaskReadRepository,
    TaskUpdateRepository,
    TaskDeleteRepository
):
    pass