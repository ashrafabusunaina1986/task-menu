# app/repositories/task/create.py


from app.models.task import Task

from app.core.database import get_tasks_collection


class TaskCreateRepository:

    async def create(
        self,
        task_data: Task
    ) -> str:
        data_model = task_data.model_dump(
            by_alias=True
        )
        data_model.pop("_id", None)

        result = await get_tasks_collection().insert_one(data_model)

        return str(result.inserted_id)
