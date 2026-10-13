# app/routes/auth/register.py

from fastapi import (
    Request,
    HTTPException,
    APIRouter,
    Depends,
    status,
)
from datetime import datetime, timezone, timedelta
from app.schemas.user.create import UserCreate
from app.security.auth.register import RegisterService
from app.core.container.register import get_register_service
from app.security.dependencies.service import DependencyService
from app.core.container.security import get_security_service
from app.services.user.service import UserService
from app.core.container.user import get_user_service
from app.services.security.security_status.register.service import (
    RegisterSecurityStatusService
)
from app.core.container.register_security_status import (
    get_register_security_status_service
)
from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.security.security_attempts.service import (
    SecurityAttemptsService as SecurityAttemptsSecurityService
)
from app.core.container.security_attempts import (
    get_security_attempts_service,
    get_security_attempts_security_service
)
from app.services.user_block.service import (
    UserBlockService
)
from app.core.container.user_block import get_user_block_service

from app.models.user_block.user_block import (
    BlockType
)

from app.schemas.user_block.read import (
    UserBlockRead,
)
from app.schemas.auth.register import RegisterBlockedResponse
from app.services.email.service import EmailService
from app.core.container.email import get_email_service
from app.core.container.pending_registration import (
    get_pending_register_service
)
from app.services.user.pending_registration.service import (
    PendingRegisterService
)
from app.schemas.user.pending_registration.create import (
    PendingRegisterCreate
)
from app.schemas.security.security_attempts.base import (
    SecurityAttemptReason,
    SecurityAttemptStatus,
    SecurityOperation
)
from app.security.otp.generator import OTPGenerator
from app.security.otp.hasher import OTPHasher
from app.security.constants import OTP_EXPIRE_MINUTES

from app.security.otp.service import OTPService
from app.core.container.otp import get_otp_security_service
from app.security.token.service import TokenService
from app.core.container.token import get_token_service
from app.schemas.security.security_attempts.security_status.otp.otp import OTPVerify
router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
async def register(
    data: UserCreate,
    request: Request,
    user_block_service: UserBlockService = Depends(
        get_user_block_service
    ),
    pending_register_service: PendingRegisterService = Depends(
        get_pending_register_service
    ),
    otp_service: OTPService = Depends(
        get_otp_security_service
    ),
    token_service: TokenService = Depends(
        get_token_service
    ),
    email_service: EmailService = Depends(
        get_email_service
    ),
    user_service: UserService = Depends(
        get_user_service
    )
):

    user = await user_service.get_by_email(
        email=data.email
    )

    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exista"
        )
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

    user_block = await user_block_service.get_active_block(
        data=UserBlockRead(
            device_id=device_id,
            block_type=BlockType.DEVICE
        )
    )

    if user_block:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=RegisterBlockedResponse(
                reason="The user is blocked",
                blocked_until=user_block.blocked_until.isoformat()
            )
        )

    create_pending_register = await pending_register_service.create(
        data=PendingRegisterCreate(
            name=data.name,
            email=data.email,
            password=data.password,
            image=data.image
        )
    )
    if create_pending_register is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create pending registration"
        )

    register_token = token_service.create_register_token(
        register_id=create_pending_register.id,
        email=create_pending_register.email
    )

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=OTP_EXPIRE_MINUTES)
    )

    otp = await otp_service.create(
        register_id=create_pending_register.id,
        expires_at=expires_at,

    )
    await email_service.send_otp(
        create_pending_register.email,
        otp=otp
    )
    return {
        "register_token": register_token,
        "message": "If the account exists and can receive an OTP, an OTP has been sent."
    }


@router.post(
    "/verify-register",
    status_code=status.HTTP_201_CREATED
)
async def register(
    data: OTPVerify,
    service: RegisterService = Depends(
        get_register_service
    ),
    register_security_status_service: RegisterSecurityStatusService = Depends(
        get_register_security_status_service
    ),
    user_block_service: UserBlockService = Depends(
        get_user_block_service
    ),
    security_attempts_service: SecurityAttemptsService = Depends(
        get_security_attempts_service
    ),
    security_attempts_security_service: SecurityAttemptsSecurityService = Depends(
        get_security_attempts_security_service
    ),
    security: DependencyService = Depends(get_security_service),
    user_service: UserService = Depends(get_user_service)
):

    print(data)

    user_id = await service.register(
        data=data
    )

    return {
        "message": "User created successfully.",
        "id": user_id
    }
