# app/services/user/base.py

from app.repositories.user.repository import UserRepository
from app.security.password.service import PasswordService


class UserServiceBase:

    def __init__(
        self,
        repository:UserRepository,
        password:PasswordService
    ):
        self.repository = repository
        self.password = password
