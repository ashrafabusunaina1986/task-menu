# app/security/exceptions/service.py

from app.security.exceptions.auth import AuthenticationException
from app.security.exceptions.permission import PermissionException
from app.security.exceptions.token import TokenException


class ExceptionService:

    def __init__(self):
        self.auth = AuthenticationException()
        self.permission = PermissionException()
        self.token = TokenException()