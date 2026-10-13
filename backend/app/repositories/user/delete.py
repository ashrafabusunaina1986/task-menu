# app/repositories/user/delete.py

from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_users_collection


class UserDeleteRepository:

    async def delete(self, user_id: str):
        try:
            return await get_users_collection().delete_one(
                {"_id": ObjectId(user_id)}
            )
        except InvalidId:
            return False
