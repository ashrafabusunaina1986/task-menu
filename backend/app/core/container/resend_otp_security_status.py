# app/core/container/resend_otp_security_status.py

from app.services.security.security_status.resend_otp.service import (
    ResendOtpSecurityStatusServices
)
from app.services.security.security_status.resend_otp.create import (
    ResendOtpSecurityStatusServiceCreate
)
from app.repositories.security.security_status.resend_otp.repository import (
    ResendOtpSecurityStatusRepository
)
from app.repositories.security.security_status.resend_otp.create import (
    ResendOtpSecurityStatusRepositoryCreate
)


def get_resend_otp_security_status_service() -> ResendOtpSecurityStatusServices:
    return ResendOtpSecurityStatusServices(
        service_create=ResendOtpSecurityStatusServiceCreate(
            repository=ResendOtpSecurityStatusRepository(
                repository_create=ResendOtpSecurityStatusRepositoryCreate()
            )
        )
    )
