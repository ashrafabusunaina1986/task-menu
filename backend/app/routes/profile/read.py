# app/routes/profile/read.py

from fastapi import APIRouter, Depends

from app.models.user.user import User
from app.schemas.user.response import UserResponse
from app.core.container.security import get_current_user_dependency

profile_router = APIRouter()


@profile_router.get(
    "/",
    response_model=UserResponse
)
async def profile(
    user: User = Depends(get_current_user_dependency),
):
    return user
