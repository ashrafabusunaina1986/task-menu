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
