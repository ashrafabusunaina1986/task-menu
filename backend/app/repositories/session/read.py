# app/repositories/session/read.py

from app.repositories.session.base import (
    SessionRepositoryBase
)

from bson import ObjectId
from bson.errors import InvalidId


class SessionReadRepository(
    SessionRepositoryBase
):

    def _serialize(
        self,
        session: dict
    ) -> dict:

        session["_id"] = str(
            session["_id"]
        )

        return session


    async def get_by_id(
        self,
        session_id: str
    ) -> dict | None:

        try:

            session = await self.collection.find_one(
                {
                    "_id": ObjectId(
                        session_id
                    )
                }
            )

        except InvalidId:

            return None


        if session:

            return self._serialize(
                session
            )

        return None


    async def get_by_refresh_token(
        self,
        refresh_token: str
    ) -> dict | None:

        session = await self.collection.find_one(
            {
                "refresh_token": refresh_token
            }
        )

        if session:

            return self._serialize(
                session
            )

        return None


    async def get_by_user(
        self,
        user_id: str
    ) -> list[dict]:

        cursor = self.collection.find(
            {
                "user_id": user_id
            }
        )

        sessions = []


        async for session in cursor:

            sessions.append(
                self._serialize(
                    session
                )
            )


        return sessions