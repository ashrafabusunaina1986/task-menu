# app/security/auth/login.py

from pydantic import EmailStr
from datetime import datetime, timezone, timedelta

from app.security.token.service import TokenService
from app.security.auth.authenticate import AuthenticationService
from app.security.session.service import SessionService
from app.security.otp.service import (
    OTPService,
    OTPVerificationResult
)
from app.services.email.service import EmailService
from app.services.user.service import UserService

from app.security.security_attempts.service import (
    SecurityAttemptsService as SecurityAttemptsSecurityService
)
from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.services.security.security_status.login.service import (
    LoginSecurityStatusService
)

from app.security.constants import OTP_EXPIRE_MINUTES

from app.schemas.auth.login import LoginBlockedResponse
from app.schemas.user.update import UserUpdate
from app.schemas.security.security_attempts.security_status.otp.otp import OTPVerify
from app.services.user_block.service import UserBlockService
from app.schemas.user_block.create import UserBlockCreate
from app.schemas.security.security_attempts.security_status.login.create import (
    LoginSecurityStatusCreate
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)
from app.schemas.security.security_attempts.base import (
    SecurityOperation,
    SecurityAttemptReason,
    SecurityAttemptStatus
)

from app.schemas.user_block.read import (
    UserBlockRead
)

from app.schemas.user_block.base import (
    BlockedUntilStatus
)
from app.models.user_block.user_block import (
    BlockType
)


class LoginService:

    def __init__(
        self,
        authentication: AuthenticationService,
        token_service: TokenService,
        session_service: SessionService,
        otp_service: OTPService,
        email_service: EmailService,
        user_service: UserService,
        user_block_service: UserBlockService,
        security_attempts_service: SecurityAttemptsService,
        security_attempts_security_service: SecurityAttemptsSecurityService,
        login_security_status_service: LoginSecurityStatusService
    ):
        self.authentication = authentication
        self.token_service = token_service
        self.session_service = session_service
        self.otp_service = otp_service
        self.email_service = email_service
        self.user_service = user_service
        self.user_block_service = user_block_service
        self.security_attempts_security_service = security_attempts_security_service
        self.security_attempts_service = security_attempts_service
        self.login_security_status_service = login_security_status_service

    async def login(
        self,
        email: EmailStr,
        password: str,
        ip_id: str,
        device_id: str
    ) -> dict | LoginBlockedResponse | None:

        user_block = await self.user_block_service.get_active_block(
            data=UserBlockRead(
                device_id=device_id,
                block_type=BlockType.DEVICE
            )
        )

        if user_block:
            print(
                "LOGIN BLOCKED UNTIL:",
                user_block.blocked_until
            )
            return LoginBlockedResponse(
                reason=user_block.reason,
                blocked_until=user_block.blocked_until
            )

        user = await self.authentication.authenticate(
            email=email,
            password=password
        )

        if not user:
            max_attempts = self.security_attempts_security_service.max_attempts(
                operation=SecurityOperation.LOGIN
            )
            security_attempts = await self.security_attempts_service.record_attempt(
                data=SecurityAttemptsRead(
                    ip_id=ip_id,
                    device_id=device_id,
                    type_operation=SecurityOperation.LOGIN
                ),
                max_attempts=max_attempts
            )
            if not security_attempts:
                return None

            if security_attempts.is_blocked:
                await self.login_security_status_service.create(
                    data=LoginSecurityStatusCreate(
                        security_attempts_id=security_attempts.id,
                        email=email,
                        status=SecurityAttemptStatus.BLOCKED,
                        reason=SecurityAttemptReason.ACTIVE_BLOCK
                    )
                )

            else:
                await self.login_security_status_service.create(
                    data=LoginSecurityStatusCreate(
                        security_attempts_id=security_attempts.id,
                        email=email,
                        status=SecurityAttemptStatus.FAILED,
                        reason=SecurityAttemptReason.INVALID_CREDENTIALS
                    )
                )
            should_block = self.security_attempts_security_service.should_block(
                security_attempts=security_attempts
            )
            if should_block:
                blocked_until = (
                    datetime.now(timezone.utc) +
                    timedelta(minutes=BlockedUntilStatus.LOGIN)
                )
                user_block = await self.user_block_service.create(
                    data=UserBlockCreate(
                        device_id=device_id,
                        block_type=BlockType.DEVICE,
                        reason=SecurityAttemptReason.TOO_MANY_ATTEMPTS,
                        blocked_until=blocked_until
                    )
                )
                await self.security_attempts_service.deactivate(
                    data=SecurityAttemptsDeactivate(
                        ip_id=ip_id,
                        device_id=device_id,
                        type_operation=SecurityOperation.LOGIN
                    )
                )

                return LoginBlockedResponse(
                    reason=user_block.reason,
                    blocked_until=user_block.blocked_until
                )
            return None

        user_block = await self.user_block_service.get_active_block(
            data=UserBlockRead(
                user_id=user.id,
                block_type=BlockType.USER
            )
        )
        if user_block:
            return LoginBlockedResponse(
                reason="The user is blocked",
                blocked_until=user_block.blocked_until.isoformat()
            )

        expires_at = (
            datetime.now(timezone.utc) +
            timedelta(minutes=OTP_EXPIRE_MINUTES)
        )

        otp = await self.otp_service.create(
            user_id=user.id,
            expires_at=expires_at
        )

        await self.email_service.send_otp(
            email=user.email,
            otp=otp
        )
        await self.security_attempts_service.deactivate(
            data=SecurityAttemptsDeactivate(
                ip_id=ip_id,
                device_id=device_id,
                type_operation=SecurityOperation.LOGIN
            )
        )
        return {
            "otp_required": True,
            "user_id": user.id,
            "message": "Verification code sent"
        }

    async def verify_login(
        self,
        data: OTPVerify,
        device_id: str | None = None,
        ip_id: str | None = None
    ) -> dict | LoginBlockedResponse | None:
        
        user_block = await self.user_block_service.get_active_block(
            data=UserBlockRead(
                user_id=data.user_id,
                block_type=BlockType.USER
            )
        )

        if user_block:
            print(
                "LOGIN BLOCKED UNTIL:",
                user_block.blocked_until
            )
            return LoginBlockedResponse(
                reason=user_block.reason,
                blocked_until=user_block.blocked_until
            )

        user = await self.user_service.get_by_id(
            user_id=data.user_id
        )

        if not user:
            return {
                "success": False,
                "message": "Email is missing"
            }

        result = await self.otp_service.verify(
            user_id=user.id,
            otp=data.otp

        )

        if result != OTPVerificationResult.VALID:
            max_attempts = self.security_attempts_security_service.max_attempts(
                operation=SecurityOperation.LOGIN_OTP
            )
            security_attempts = await self.security_attempts_service.record_attempt(
                data=SecurityAttemptsRead(
                    user_id=user.id,
                    ip_id=ip_id,
                    device_id=device_id,
                    type_operation=SecurityOperation.LOGIN_OTP
                ),
                max_attempts=max_attempts
            )

            if not security_attempts:
                return None

            if security_attempts.is_blocked:
                await self.login_security_status_service.create(
                    data=LoginSecurityStatusCreate(
                        operation=SecurityOperation.LOGIN_OTP,
                        user_id=user.id,
                        email=user.email,
                        security_attempts_id=security_attempts.id,
                        status=SecurityAttemptStatus.BLOCKED,
                        reason=SecurityAttemptReason.ACTIVE_BLOCK
                    )
                )

            else:
                await self.login_security_status_service.create(
                    data=LoginSecurityStatusCreate(
                        operation=SecurityOperation.LOGIN_OTP,
                        user_id=user.id,
                        email=user.email,
                        security_attempts_id=security_attempts.id,
                        status=SecurityAttemptStatus.FAILED,
                        reason=result.value
                    )
                )

            should_block = self.security_attempts_security_service.should_block(
                security_attempts=security_attempts
            )
            if should_block:

                blocked_until = (
                    datetime.now(timezone.utc) +
                    timedelta(minutes=BlockedUntilStatus.LOGIN_OTP)
                )
                user_block = await self.user_block_service.create(
                    data=UserBlockCreate(
                        user_id=user.id,
                        block_type=BlockType.USER,
                        reason=SecurityAttemptReason.TOO_MANY_ATTEMPTS,
                        blocked_until=blocked_until
                    )
                )
                await self.security_attempts_service.deactivate(
                    data=SecurityAttemptsDeactivate(
                        ip_id=ip_id,
                        device_id=device_id,
                        user_id=user.id,
                        type_operation=SecurityOperation.LOGIN_OTP
                    )
                )

                return LoginBlockedResponse(
                    reason=user_block.reason,
                    blocked_until=user_block.blocked_until
                )
            return None
        await self.security_attempts_service.deactivate(
            data=SecurityAttemptsDeactivate(
                user_id=user.id,
                ip_id=ip_id,
                device_id=device_id,
                type_operation=SecurityOperation.LOGIN_OTP
            )
        )
        await self.user_service.update(
            user_id=user.id,
            data=UserUpdate(
                is_verified=True
            )
        )
        user = await self.user_service.get_by_email(
            email=user.email
        )

        access_token = self.token_service.create_access_token(
            user_id=user.id
        )

        refresh_token = self.token_service.create_refresh_token(
            user_id=user.id
        )

        session_id = await self.session_service.create.create(
            user_id=user.id,
            refresh_token=refresh_token,
            device=device_id,
            ip_address=ip_id
        )

        return {
            "user": user,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "session_id": session_id
        }
