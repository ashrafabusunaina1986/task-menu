# app/repositories/session/delete.py

from bson import ObjectId
from bson .errors import InvalidId

from app.repositories.session.base import SessionRepositoryBase


class SessionDeleteRepository(
    SessionRepositoryBase
):

    async def delete(
        self,
        session_id: str
    ) -> bool:
        try:
            result = await self.collection.delete_one(
                {
                    "_id": ObjectId(
                        session_id
                    )
                }
            )
            return (
                result.deleted_count > 0
            )
        except InvalidId:
            return False
