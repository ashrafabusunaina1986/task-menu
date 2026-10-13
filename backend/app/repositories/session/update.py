# app/repository/session/update.py

from bson import ObjectId
from bson.errors import InvalidId

from app.repositories.session.base import SessionRepositoryBase


class SessionUpdateRepository(
    SessionRepositoryBase
):

    async def update(
        self,
        session_id: str,
        data: dict
    ):
        try:
            return await self.collection.update_one(
                {
                    "_id": ObjectId(
                        session_id
                    )
                },

                {
                    "$set": data
                }
            )
        except  InvalidId:
            return None
        