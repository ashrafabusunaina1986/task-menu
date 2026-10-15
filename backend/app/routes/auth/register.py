# app/routes/auth/register.py

from fastapi import (
    Request,
    HTTPException,
    APIRouter,
    Depends,
    status,
)

from datetime import datetime, timezone, timedelta
from app.schemas.user.create import UserCreate, RegisterUser
from app.security.auth.register import RegisterService
from app.core.container.register import get_register_service
from app.security.dependencies.service import DependencyService
from app.core.container.security import get_security_service
from app.services.user.service import UserService
from app.core.container.user import get_user_service
from app.services.security.security_status.register.service import (
    RegisterSecurityStatusService
)
from app.schemas.security.security_attempts.security_status.register.create import (
    RegisterSecurityStatusCreate
)
from app.core.container.register_security_status import (
    get_register_security_status_service
)
from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
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
from app.schemas.user_block.create import (
    UserBlockCreate,
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
from app.schemas.user.pending_registration.read import (
    PendingRegisterRead
)
from app.schemas.security.security_attempts.base import (
    SecurityAttemptReason,
    SecurityAttemptStatus,
    SecurityOperation
)
from app.security.constants import OTP_EXPIRE_MINUTES

from app.security.otp.service import OTPService, OTPVerificationResult
from app.core.container.otp import get_otp_security_service
from app.security.token.service import TokenService, TokenTypes
from app.core.container.token import get_token_service
from app.schemas.security.security_attempts.security_status.otp.otp import OTPVerify
from app.schemas.user_block.base import BlockedUntilStatus

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
        register_id=str(create_pending_register.id),
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
async def verify_register(
    data: OTPVerify,
    request: Request,
    service: RegisterService = Depends(
        get_register_service
    ),
    token_service: TokenService = Depends(
        get_token_service
    ),
    otp_service: OTPService = Depends(
        get_otp_security_service
    ),
    pending_register_service: PendingRegisterService = Depends(
        get_pending_register_service
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

    if data.register_token is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="register token not found"
        )

    valid_token = token_service.verify_token(
        token=data.register_token,
        token_type=TokenTypes.REGISTER
    )
    register_id = valid_token["sub"]
    user_block = await user_block_service.get_active_block(
        data=UserBlockRead(
            register_id=register_id,
            block_type=BlockType.REGISTER
        )
    )

    if user_block:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=RegisterBlockedResponse(
                reason=user_block.reason,
                blocked_until=user_block.blocked_until.isoformat()
            ).model_dump(mode="json")
        )

    result = await otp_service.verify(
        register_id=register_id,
        otp=data.otp
    )
    if result != OTPVerificationResult.VALID:

        max_attempts = security_attempts_security_service.max_attempts(
            operation=SecurityOperation.REGISTER_OTP
        )
        security_attempts = await security_attempts_service.record_attempt(
            data=SecurityAttemptsRead(
                ip_id=ip_id,
                device_id=device_id,
                register_id=register_id,
                type_operation=SecurityOperation.REGISTER_OTP
            ),
            max_attempts=max_attempts
        )

        if not security_attempts:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Security attempts record not found"
            )

        if security_attempts.is_blocked:
            await register_security_status_service.create(
                data=RegisterSecurityStatusCreate(
                    security_attempts_id=security_attempts.id,
                    email=valid_token["email"],
                    operation=SecurityOperation.REGISTER_OTP,
                    status=SecurityAttemptStatus.FAILED,
                    reason=SecurityAttemptReason.ACTIVE_BLOCK
                )
            )
        else:
            await register_security_status_service.create(
                data=RegisterSecurityStatusCreate(
                    security_attempts_id=security_attempts.id,
                    email=valid_token["email"],
                    operation=SecurityOperation.REGISTER_OTP,
                    status=SecurityAttemptStatus.FAILED,
                    reason=SecurityAttemptReason.INVALID_OTP
                )
            )

        should_block = security_attempts_security_service.should_block(
            security_attempts=security_attempts
        )

        if should_block:
            blocked_until = (
                datetime.now(timezone.utc) +
                timedelta(minutes=BlockedUntilStatus.REGISTER_OTP)
            )
            user_block = await user_block_service.create(
                data=UserBlockCreate(
                    register_id=register_id,
                    block_type=BlockType.REGISTER,
                    reason=SecurityAttemptReason.TOO_MANY_ATTEMPTS,
                    blocked_until=blocked_until
                )
            )
            await security_attempts_service.deactivate(
                data=SecurityAttemptsDeactivate(
                    ip_id=ip_id,
                    device_id=device_id,
                    register_id=register_id,
                    type_operation=SecurityOperation.REGISTER_OTP
                )
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=RegisterBlockedResponse(
                    reason=user_block.reason,
                    blocked_until=user_block.blocked_until.isoformat()
                ).model_dump(mode="json")
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.value
        )

    await security_attempts_service.deactivate(
        data=SecurityAttemptsDeactivate(
            ip_id=ip_id,
            device_id=device_id,
            register_id=register_id,
            type_operation=SecurityOperation.REGISTER_OTP
        )
    )
    pending_register = await pending_register_service.get_pending_register(
        data=PendingRegisterRead(
            register_id=register_id
        )
    )

    if not pending_register:
        raise HTTPException(
            status_code=404,
            detail="Pending registration not found or expired."
        )
    data_register = RegisterUser(
        name=pending_register.name,
        email=pending_register.email,
        hashed_password=pending_register.hashed_password,
        image=pending_register.image
    )

    register_result = await service.register(
        data=data_register
    )

    await pending_register_service.delete_pending_register_id(
        register_id=register_id
    )

    return {
        "message": "User created successfully.",
        "user_id": register_result
    }
