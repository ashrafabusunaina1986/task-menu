from enum import Enum
from typing import Optional

from pydantic import BaseModel


class SecurityOperation(str, Enum):
    LOGIN = "login"
    LOGIN_OTP = "login_otp"
    GOOGLE_LOGIN = "google_login"
    REGISTER = "register"
    REGISTER_OTP = "register_otp"
    RESEND_OTP = "resend_otp"


class SecurityMaxAttempts(int, Enum):
    LOGIN = 5
    LOGIN_OTP = 5
    GOOGLE_LOGIN = 3
    REGISTER = 10
    REGISTER_OTP = 5
    RESEND_OTP = 2


class SecurityAttemptReason(str, Enum):
    INVALID_CREDENTIALS = "invalid credentials"
    INVALID_OTP = "invalid otp"
    EXPIRED_OTP = "expired otp"
    TOO_MANY_ATTEMPTS = "too many attempts"
    ACTIVE_BLOCK = "active block"
    EMAIL_SEND_FAILED = "email send failed"
    USER_NOT_FOUND = "user not found"
    INVALID_TOKEN = "invalid token"
    OTP_SENT_SUCCESSFULLY = "otp sent successfully"
    USER_EXCEEDED_THE_MAXIMUM_ALLOWED_OTP_RESEND_ATTEMPTS = "user exceeded the maximum allowed OTP resend attempts"


class SecurityAttemptStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
    BLOCKED = "blocked"


class SecurityBlockStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    RELEASED = "released"


class SecurityAttemptsBase(BaseModel):
    user_id: Optional[str] = None
    ip_id: Optional[str] = None
    device_id: Optional[str] = None
    session_id: Optional[str] = None
    register_id:Optional[str]=None
    max_attempts: SecurityMaxAttempts
    type_operation: SecurityOperation
