# app/repositories/user/repository.py

from app.repositories.user.create import UserCreateRepository
from app.repositories.user.delete import UserDeleteRepository
from app.repositories.user.read import UserReadRepository
from app.repositories.user.update import UserUpdateRepository


class UserRepository(
    UserUpdateRepository,
    UserReadRepository,
    UserDeleteRepository,
    UserCreateRepository
):
    pass
