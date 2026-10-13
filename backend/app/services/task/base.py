# app/services/task/base.py

from app.repositories.task.repository import TaskRepository


class TaskServiceBase:

    def __init__(self):
        self.repository = TaskRepository()