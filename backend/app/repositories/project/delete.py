# app/repositories/project/delete.py


from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorClientSession

from app.core.database import get_project_collection


class ProjectRepositoryDelete:

    @property
    def collection(self):
        return get_project_collection()

    async def delete(
        self,
        project_id: str,
        session: AsyncIOMotorClientSession | None = None
    ) -> bool:
        try:
            object_id = ObjectId(project_id)
        except (InvalidId, TypeError):
            return False

        deleted = await self.collection.delete_one(
            {
                "_id": object_id
            },
            session=session
        )

        return deleted.deleted_count == 1
