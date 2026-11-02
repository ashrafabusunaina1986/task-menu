# app/repositories/user/read.py

from bson import ObjectId
from bson.errors import InvalidId
from pydantic import EmailStr

from app.core.database import get_users_collection


class UserReadRepository:

    async def get_all(self):
        cursor = get_users_collection().find()

        users = []

        async for user in cursor:
            user["_id"] = str(user["_id"])
            users.append(user)

        return users

    async def get_users_for_select(self):
        """
        Optimized database matrix to fetch verified infrastructure operators
        strictly matching the mapped Pydantic validation schema properties.
        """
        users = await get_users_collection().find(
            {"is_active": True, "is_verified": True},
            {"_id": 1, "name": 1, "email": 1,"role":1}
        ).to_list(length=500)
        result: list = []
        for user in users:
            user["_id"] = str(user["_id"])
            
            result.append(user)
        return result

    async def get_by_id(self, user_id: str):
        try:
            user = await get_users_collection().find_one(
                {"_id": ObjectId(user_id)}
            )
        except InvalidId:
            return None

        if user:
            user["_id"] = str(user["_id"])

        return user

    async def get_by_email(self, email: EmailStr):

        user = await get_users_collection().find_one(
            {"email": email.lower()}
        )
        if user:
            user["_id"] = str(user["_id"])

        return user
