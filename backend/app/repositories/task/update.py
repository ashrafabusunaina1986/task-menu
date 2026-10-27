# app/repositories/task/update.py

from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_tasks_collection


class TaskUpdateRepository:

    # ==============================
    # ADMIN/PUBLIC
    # ==============================

    async def update(
        self,
        task_id: str,
        project_id: str,
        data: dict
    ):
        now = datetime.now(timezone.utc)

        try:

            update_data = {
                **data,
                "updated_at": now
            }

            return await get_tasks_collection().update_one(
                {
                    "_id": ObjectId(task_id),
                    "project_id": project_id
                },
                {
                    "$set": update_data
                }
            )

        except InvalidId:
            return None

    # ==============================
    # OWNER
    # ==============================

    async def update_by_user(
        self,
        task_id: str,
        user_id: str,
        project_id: str,
        data: dict
    ):
        now = datetime.now(timezone.utc)
        try:

            update_data = {
                **data,
                "updated_at": now
            }

            return await get_tasks_collection().update_one(
                {
                    "_id": ObjectId(task_id),
                    "user_id": user_id,
                    "project_id": project_id
                },
                {
                    "$set": update_data
                }
            )

        except InvalidId:
            return None
