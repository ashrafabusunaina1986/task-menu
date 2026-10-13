# app/core/container/login.py

from fastapi import Depends

from app.security.password.hasher import PasswordHasher
from app.security.auth.authenticate import AuthenticationService
from app.security.auth.login import LoginService
from app.security.otp.service import OTPService
from app.services.email.service import EmailService
from app.repositories.security.security_status.otp.repository import OTPRepository

from app.core.container.user import get_user_service
from app.core.container.token import get_token_service
from app.core.container.session import get_session_service
from app.core.container.user_block import get_user_block_service

from app.core.container.security_attempts import (
    get_security_attempts_security_service,
    get_security_attempts_service
)
from app.core.container.login_security_status import (
    get_login_security_status_service
)


def get_login_service(
    user_service=Depends(get_user_service),
    token_service=Depends(get_token_service),
    session_service=Depends(get_session_service),
    user_block_service=Depends(get_user_block_service),
    security_attempts_service=Depends(
        get_security_attempts_service
    ),
    security_attempts_security_service=Depends(
        get_security_attempts_security_service
    ),
    login_security_status_service=Depends(
        get_login_security_status_service
    )
) -> LoginService:

    authentication = AuthenticationService(
        user_service=user_service,
        password_hasher=PasswordHasher()
    )
    otp_service = OTPService(
        otp_repository=OTPRepository()
    )
    email_service = EmailService()

    return LoginService(
        authentication=authentication,
        token_service=token_service,
        session_service=session_service,
        otp_service=otp_service,
        email_service=email_service,
        user_service=user_service,
        user_block_service=user_block_service,
        security_attempts_service=security_attempts_service,
        security_attempts_security_service=security_attempts_security_service,
        login_security_status_service=login_security_status_service
    )
