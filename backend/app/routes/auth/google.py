# app/routes/auth/google.py

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Request
)

from app.schemas.user.google import GoogleLogin
from app.security.auth.google import GoogleAuthService
from app.core.container.google_auth import get_google_auth_service


router = APIRouter()


@router.post("/google", status_code=status.HTTP_200_OK)
async def google_login(
    data: GoogleLogin,
    request: Request,
    service: GoogleAuthService = Depends(
        get_google_auth_service
    )
):
    ip_id = request.headers.get(
        "CF-Connecting-IP"
    )

    device_id = request.headers.get(
        "X-Device-ID"
    )
    try:
        result = await service.authenticate(
            google_token=data.id_token,
            device_id=device_id,
            ip_id=ip_id

        )
        if result.get("blocked"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "blocked": True,
                    "reason": result["reason"],
                    "blocked_until": result["blocked_until"].isoformat()
                }
            )

        return result
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
