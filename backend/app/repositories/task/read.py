# app/repositories/task/read.py

from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_tasks_collection


class TaskReadRepository:

    # ==============================
    # ADMIN/PUBLIC
    # ==============================

    async def get_all(
        self,
        project_id: str
    ) -> list[dict]:

        cursor = get_tasks_collection().find({"project_id": project_id})

        tasks = []

        async for task in cursor:

            task["_id"] = str(task["_id"])

            if "created_at" in task:
                task["created_at"] = task["created_at"].isoformat()

            if "updated_at" in task:
                task["updated_at"] = task["updated_at"].isoformat()

            tasks.append(task)

        return tasks

    async def get_by_id(
        self,
        task_id: str,
        project_id: str
    ) -> dict | None:

        try:

            task = await get_tasks_collection().find_one(
                {
                    "_id": ObjectId(task_id),
                    "project_id": project_id
                }
            )

        except InvalidId:
            return None

        if task:

            task["_id"] = str(task["_id"])

            if "created_at" in task:
                task["created_at"] = task["created_at"].isoformat()

            if "updated_at" in task:
                task["updated_at"] = task["updated_at"].isoformat()

        return task

    # ==============================
    # OWNER
    # ==============================

    async def get_user_tasks(
        self,
        user_id: str,
        project_id: str
    ) -> list[dict]:

        cursor = get_tasks_collection().find(
            {
                "user_id": user_id,
                "project_id": project_id
            }
        )

        tasks = []

        async for task in cursor:

            task["_id"] = str(task["_id"])

            if "created_at" in task:
                task["created_at"] = task["created_at"].isoformat()

            if "updated_at" in task:
                task["updated_at"] = task["updated_at"].isoformat()

            tasks.append(task)

        return tasks

    async def get_user_task_by_id(
        self,
        task_id: str,
        user_id: str,
        project_id: str
    ) -> dict | None:

        try:

            task = await get_tasks_collection().find_one(
                {
                    "_id": ObjectId(task_id),
                    "user_id": user_id,
                    "project_id": project_id
                }
            )

        except InvalidId:
            return None

        if task:

            task["_id"] = str(task["_id"])

            if "created_at" in task:
                task["created_at"] = task["created_at"].isoformat()

            if "updated_at" in task:
                task["updated_at"] = task["updated_at"].isoformat()

        return task
