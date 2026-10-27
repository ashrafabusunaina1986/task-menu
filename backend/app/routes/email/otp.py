# app/routes/email/otp.py

from fastapi import (
    APIRouter,
    Depends,
    Request,
    status,
    HTTPException
)
from datetime import datetime, timedelta, timezone

from app.schemas.auth.login import LoginBlockedResponse
from app.schemas.user_block.base import (
    BlockType,
)
from app.schemas.user_block.create import (
    UserBlockCreate
)
from app.schemas.user_block.read import (
    UserBlockRead
)
from app.schemas.user_block.base import (
    BlockedUntilStatus
)
from app.schemas.security.security_attempts.base import (
    SecurityOperation,
    SecurityAttemptReason,
    SecurityAttemptStatus
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)
from app.schemas.security.security_attempts.security_status.otp.otp import (
    OTPRequest,
    OTPVerify
)
from app.schemas.security.security_attempts.security_status.resend_otp.create import (
    ResendOtpSecurityStatusCreate
)
from app.services.email.service import EmailService
from app.core.container.email import get_email_service
from app.core.container.otp import get_otp_security_service
from app.core.container.otp import get_otp_service
from app.security.otp.service import OTPService as OTPSecurityService
from app.services.security.security_status.otp.service import OTPService
from app.security.otp.generator import OTPGenerator
from app.security.otp.hasher import OTPHasher
from app.core.container.user import get_user_service
from app.services.user.service import UserService
from app.security.constants import OTP_EXPIRE_MINUTES

from app.services.user_block.service import (
    UserBlockService
)
from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.security.security_attempts.service import (
    SecurityAttemptsService as SecurityAttemptsSecurityService
)
from app.services.security.security_status.resend_otp.service import (
    ResendOtpSecurityStatusServices
)

from app.core.container.user_block import (
    get_user_block_service
)
from app.core.container.security_attempts import (
    get_security_attempts_security_service,
    get_security_attempts_service
)
from app.core.container.resend_otp_security_status import (
    get_resend_otp_security_status_service
)
from app.services.user.pending_registration.service import (
    PendingRegisterService
)
from app.core.container.pending_registration import (
    get_pending_register_service
)
from app.schemas.user.pending_registration.read import (
    PendingRegisterRead
)

router = APIRouter()


@router.post("/send-otp")
async def send_otp(
    data: OTPRequest,
    email_service: EmailService = Depends(get_email_service),
    otp_security: OTPSecurityService = Depends(
        get_otp_security_service
    )
):
    expires_at = (
        datetime.now(timezone.utc) +
        timedelta(minutes=OTP_EXPIRE_MINUTES)
    )
    otp = await otp_security.create(
        user_id=data.email,
        expires_at=expires_at
    )

    return await email_service.send_otp(
        email=data.email,
        otp=otp
    )


@router.post("/verify-otp")
async def verify_otp(
    data: OTPVerify,
    otp_security: OTPSecurityService = Depends(
        get_otp_security_service
    )
):

    return await otp_security.verify(
        user_id=data.email,
        otp=data.otp
    )


@router.post('/resend-otp')
async def resend_otp(
    data: OTPRequest,
    request: Request,
    email_service: EmailService = Depends(
        get_email_service
    ),
    otp_service: OTPService = Depends(
        get_otp_service
    ),
    user_service: UserService = Depends(get_user_service),
    security_attempts_service: SecurityAttemptsService = Depends(
        get_security_attempts_service
    ),
    resend_otp_security_status_service: ResendOtpSecurityStatusServices = Depends(
        get_resend_otp_security_status_service
    ),
    user_block_service: UserBlockService = Depends(
        get_user_block_service
    ),
    security_attempts_security_service: SecurityAttemptsSecurityService = Depends(
        get_security_attempts_security_service
    ),
    pending_register_service: PendingRegisterService = Depends(
        get_pending_register_service
    ),
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
            detail="IP id is required"
        )
    if not device_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device id is required"
        )

    pending_register = await pending_register_service.get_pending_register(
        data=PendingRegisterRead(
            email=data.email
        )
    )
    user = await user_service.get_by_email(
        email=data.email
    )
    if not user or pending_register:
        return {
            "success": True,
            "message": "If the account exists and can receive an OTP, an OTP has been sent."
        }

    user_block = await user_block_service.get_active_block(
        data=UserBlockRead(
            user_id=user.id,
            block_type=BlockType.USER
        )
    )
    if user_block:
        return LoginBlockedResponse(
            reason=user_block.reason,
            blocked_until=user_block.blocked_until.isoformat()
        )

    otp_record = await otp_service.get_active_by_user_id(
        user_id=user.id
    )
    if not otp_record or not otp_record.id:
        return {
            "success": False,
            "message": "Invalid or expired OTP"
        }

    max_attempts = security_attempts_security_service.max_attempts(
        operation=SecurityOperation.RESEND_OTP
    )
    security_attempts = await security_attempts_service.record_attempt(
        data=SecurityAttemptsRead(
            user_id=user.id,
            type_operation=SecurityOperation.RESEND_OTP,
            device_id=device_id,
            ip_id=ip_id
        ),
        max_attempts=max_attempts
    )
    if not security_attempts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not found security attempt"
        )
    if security_attempts.is_blocked:
        await resend_otp_security_status_service.create(
            data=ResendOtpSecurityStatusCreate(
                security_attempts_id=security_attempts.id,
                operation=SecurityOperation.RESEND_OTP,
                user_id=user.id,
                email=user.email,
                status=SecurityAttemptStatus.BLOCKED,
                reason=SecurityAttemptReason.ACTIVE_BLOCK
            )

        )
    else:
        await resend_otp_security_status_service.create(
            data=ResendOtpSecurityStatusCreate(
                security_attempts_id=security_attempts.id,
                operation=SecurityOperation.RESEND_OTP,
                user_id=user.id,
                email=user.email,
                status=SecurityAttemptStatus.SUCCESS,
                reason=SecurityAttemptReason.OTP_SENT_SUCCESSFULLY
            )
        )

    should_block = security_attempts_security_service.should_block(
        security_attempts=security_attempts
    )
    if should_block:
        blocked_until = (
            datetime.now(timezone.utc) +
            timedelta(minutes=BlockedUntilStatus.RESEND_OTP)
        )

        user_block = await user_block_service.create(
            data=UserBlockCreate(
                user_id=user.id,
                ip_id=ip_id,
                device_id=device_id,
                block_type=BlockType.USER,
                reason=SecurityAttemptReason.USER_EXCEEDED_THE_MAXIMUM_ALLOWED_OTP_RESEND_ATTEMPTS,
                blocked_until=blocked_until
            )
        )
        await security_attempts_service.deactivate(
            data=SecurityAttemptsDeactivate(
                ip_id=ip_id,
                device_id=device_id,
                user_id=user.id,
                type_operation=SecurityOperation.RESEND_OTP
            )
        )
        return LoginBlockedResponse(
            reason=user_block.reason,
            blocked_until=user_block.blocked_until.isoformat()
        )
    otp = OTPGenerator.generate()

    otp_hash = OTPHasher.hash(
        otp=otp
    )

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=OTP_EXPIRE_MINUTES)
    )

    updated = await otp_service.resend(
        otp_id=otp_record.id,
        otp_hash=otp_hash,
        expires_at=expires_at
    )

    if not updated:
        return {
            "success": True,
            "message": "If the account exists and can receive an OTP, an OTP has been sent."
        }
    await email_service.send_otp(
        email=user.email,
        otp=otp
    )
    return {
        "success": True,
        "message": "If the account exists and can receive an OTP, an OTP has been sent."
    }
