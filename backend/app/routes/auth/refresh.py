# app/routes/auth/refresh.py

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from app.schemas.auth.refresh import RefreshTokenRequest

from app.security.token.service import TokenService
from app.security.token.types import TokenTypes

from app.security.session.service import SessionService

from app.core.container.security import (
    get_token_service
)

from app.core.container.session import (
    get_session_service
)


router = APIRouter()


@router.post("/refresh")
async def refresh_token(
    data: RefreshTokenRequest,

    token_service: TokenService = Depends(
        get_token_service
    ),

    session_service: SessionService = Depends(
        get_session_service
    )
):

    try:

        payload = token_service.verify_token(
            token=data.refresh_token,
            token_type=TokenTypes.REFRESH
        )


        session = await session_service.manager.get_by_refresh_token(
            refresh_token=data.refresh_token
        )


        if not session or session.get("active") is not True:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired"
            )


        access_token = token_service.create_access_token(
            user_id=payload["sub"]
        )


        return {
            "access_token": access_token
        }


    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )