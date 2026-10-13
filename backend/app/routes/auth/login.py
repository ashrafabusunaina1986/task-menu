# app/routes/auth/login.py

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Request
)
from app.schemas.auth.login import LoginBlockedResponse
from app.schemas.user.login import UserLogin
from app.schemas.security.security_attempts.security_status.otp.otp import OTPVerify

from app.security.auth.login import LoginService
from app.core.container.login import get_login_service


router = APIRouter()


@router.post(
    "/login",
    status_code=status.HTTP_200_OK
)
async def login(
    data: UserLogin,
    request: Request,
    service: LoginService = Depends(get_login_service),
):

    ip_id = request.headers.get(
        "CF-Connecting-IP"
    )

    device_id = request.headers.get(
        "X-Device-ID"
    )

    if not ip_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client IP is required"
        )

    if not device_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device ID is required"
        )

    result = await service.login(
        email=data.email,
        password=data.password,
        ip_id=ip_id,
        device_id=device_id
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if isinstance(result, LoginBlockedResponse):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "blocked": True,
                "reason": result.reason,
                "blocked_until": result.blocked_until.isoformat()
            }
        )

    return result


@router.post(
    "/verify-login",
    status_code=status.HTTP_200_OK
)
async def verify_login(
    data: OTPVerify,
    request: Request,
    service: LoginService = Depends(get_login_service)
):

    ip_id = request.headers.get(
        "CF-Connecting-IP"
    )

    device_id = request.headers.get(
        "X-Device-ID"
    )

    if not ip_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client IP is required"
        )

    if not device_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device ID is required"
        )

    result = await service.verify_login(
        data=data,
        device_id=device_id,
        ip_id=ip_id
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid verification code"
        )

    if isinstance(result, LoginBlockedResponse):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "blocked": True,
                "reason": result.reason,
                "blocked_until": result.blocked_until.isoformat()
            }
        )

    return result
