# app/services/user/delete.py

from app.services.user.base import UserServiceBase
from fastapi import HTTPException


class UserDeleteService(UserServiceBase):
    async def delete(
        self,
        user_id: str
    ) -> bool:
        result = await self.repository.delete(
            user_id=user_id
        )

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Record not deleted"
            )

        return True
