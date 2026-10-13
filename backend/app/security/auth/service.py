# app/security/auth/service.py

from app.security.auth.authenticate import AuthenticationService
from app.security.auth.current_user import CurrentUserService
from app.security.auth.login import LoginService
from app.security.auth.logout import LogoutService
from app.security.auth.register import RegisterService


class AuthService:

    def __init__(
        self,
        authentication: AuthenticationService,
        current_user: CurrentUserService,
        login: LoginService,
        logout: LogoutService,
        register: RegisterService,
    ):
        self.authentication = authentication
        self.current_user = current_user
        self.login = login
        self.logout = logout
        self.register = register
