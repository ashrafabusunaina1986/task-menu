# app/routes/project/route.py

from fastapi import APIRouter

from app.routes.project.base import base
from app.routes.project.update import update
from app.routes.project.create import create
from app.routes.project.read import read
from app.routes.project.delete import delete


class ProjectRoute:

    def __init__(self):

        self.router = APIRouter(
            prefix=base.project_prefix,
            tags=base.project_tags
        )

        self.router.include_router(
            create.router
        )

        self.router.include_router(
            update.router
        )

        self.router.include_router(
            read.router
        )

        self.router.include_router(
            delete.router
        )


project_router = ProjectRoute().router
