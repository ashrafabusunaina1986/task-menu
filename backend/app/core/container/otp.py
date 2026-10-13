# app/core/container/otp.py

from fastapi import Depends

from app.security.otp.service import OTPService as OTPSecurityService

from app.services.security.security_status.otp.resend import OTPServiceResend
from app.services.security.security_status.otp.update import OTPServiceUpdate
from app.services.security.security_status.otp.read import OTPServiceRead
from app.services.security.security_status.otp.service import OTPService

from app.repositories.security.security_status.otp.repository import OTPRepository


def get_otp_security_service() -> OTPSecurityService:
    return OTPSecurityService(
        otp_repository=OTPRepository()
    )


def get_otp_resend_service() -> OTPServiceResend:
    return OTPServiceResend(
        repository=OTPRepository()
    )


def get_otp_read_service() -> OTPServiceRead:
    return OTPServiceRead(
        repository=OTPRepository()
    )


def get_otp_update_service() -> OTPServiceUpdate:
    return OTPServiceUpdate(
        repository=OTPRepository()
    )


def get_otp_service(
    otp_service_resend: OTPServiceResend = Depends(
        get_otp_resend_service
    ),
    otp_service_update: OTPServiceUpdate = Depends(
        get_otp_update_service
    ),
    otp_service_read: OTPServiceRead = Depends(
        get_otp_read_service
    ),
) -> OTPService:
    return OTPService(
        otp_service_resend=otp_service_resend,
        otp_service_update=otp_service_update,
        otp_service_read=otp_service_read
    )
