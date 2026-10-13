# app/services/user/update.py

from fastapi import HTTPException, status

from app.services.user.base import UserServiceBase
from app.schemas.user.update import UserUpdate


class UserUpdateService(UserServiceBase):

    async def update(
        self,
        user_id: str,
        data: UserUpdate
    ) -> bool:

        update_data = data.model_dump(
            exclude_unset=True
        )

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided"
            )

        if "password" in update_data:

            password = update_data.pop(
                "password"
            )

            update_data["hashed_password"] = (
                self.password.hash(password)
            )

        result = await self.repository.update(
            user_id=user_id,
            data=update_data
        )

        if result is None or result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return True
