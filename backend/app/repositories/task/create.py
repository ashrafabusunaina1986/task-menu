# app/repositories/task/create.py

from datetime import datetime

from app.core.database import get_tasks_collection


class TaskCreateRepository:

    async def create(
        self,
        task_data: dict
    ) -> str:

        now = datetime.utcnow()

        task_data["created_at"] = now
        task_data["updated_at"] = now

        result = await get_tasks_collection().insert_one(
            task_data
        )

        return str(result.inserted_id)