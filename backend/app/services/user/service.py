# app/services/user/service.py

from app.services.user.delete import UserDeleteService
from app.services.user.update import UserUpdateService
from app.services.user.create import UserCreateService
from app.services.user.read import UserReadService


class UserService(
    UserReadService,
    UserCreateService,
    UserUpdateService,
    UserDeleteService
):
    pass
