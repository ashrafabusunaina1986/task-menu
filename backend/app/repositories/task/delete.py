# app/repositories/task/delete.py

from motor.motor_asyncio import AsyncIOMotorClientSession

from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_tasks_collection


class TaskDeleteRepository:

    # =============================
    # ADMIN/PUBLIC
    # =============================

    async def delete(
        self,
        task_id: str,
        project_id: str,
        session: AsyncIOMotorClientSession | None = None
    ) -> bool:

        try:

            result = await get_tasks_collection().delete_one(
                {
                    "_id": ObjectId(task_id),
                    "project_id":project_id
                },
                session=session
            )

            return result.deleted_count > 0

        except InvalidId:
            return False

    # =============================
    # OWNER
    # =============================

    async def delete_by_user(
        self,
        task_id: str,
        user_id: str,
        project_id: str,
        session: AsyncIOMotorClientSession | None = None
    ) -> bool:

        try:

            result = await get_tasks_collection().delete_one(
                {
                    "_id": ObjectId(task_id),
                    "user_id": user_id,
                    "project_id":project_id
                },
                session=session
            )

            return result.deleted_count > 0

        except InvalidId:
            return False

    # ==================================
    # DELETE TASKS
    # ==================================

    async def delete_tasks(self, project_id: str, session: AsyncIOMotorClientSession | None = None) -> bool:

        if not project_id:
            return False

        await get_tasks_collection().delete_many(
            {"project_id": project_id},
            session=session
        )
        return True
