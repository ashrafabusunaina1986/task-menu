# app/routes/auth/logout.py

from fastapi import APIRouter, Depends, HTTPException, status

from app.security.auth.logout import LogoutService
from app.core.container.logout import get_logout_service
from app.schemas.auth.refresh import RefreshTokenRequest
router = APIRouter()


@router.post("/logout")
async def logout(
    payload: RefreshTokenRequest,
    service: LogoutService = Depends(get_logout_service)
):

    result = await service.logout(
        refresh_token=payload.refresh_token
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Logout failed"
        )

    return {
        "message": "Logged out successfully"
    }
