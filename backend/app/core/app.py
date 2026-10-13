# app/core/app.py

from contextlib import asynccontextmanager

from app.middleware.cors import setup_cors

from fastapi import FastAPI

from app.core.database import MongoDB

from app.routes.task.route import router_task
from app.routes.user.route import router as user_router
from app.routes.auth.route import router as auth_router
from app.routes.profile.route import router as profile_router
from app.routes.recaptcha.route import router as recaptcha_router
from app.routes.email.route import router as send_email_public_router
from app.routes.user_block.route import UserBlockRoute
from app.routes.security_attempts.route import (
    SecurityAttemptsRoute
)

from app.core.config import settings
from app.middleware.swagger import setup_swagger_protection


def create_app() -> FastAPI:

    @asynccontextmanager
    async def lifecycle(app: FastAPI):

        await MongoDB.connect()

        yield

        MongoDB.close()

    app = FastAPI(
        docs_url="/docs",
        openapi_url="/openapi.json",
        redoc_url=None,
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        lifespan=lifecycle
    )

    setup_cors(app)

    setup_swagger_protection(app)

    register_routes(app)

    roots(app)

    return app


def register_routes(
    app: FastAPI
):

    app.include_router(
        router_task
    )

    app.include_router(

        user_router,
        prefix="/auth",
    )

    app.include_router(
        auth_router
    )

    app.include_router(
        profile_router
    )

    app.include_router(
        recaptcha_router
    )

    app.include_router(
        send_email_public_router
    )

    app.include_router(
        UserBlockRoute().router
    )

    app.include_router(
        SecurityAttemptsRoute().router
    )


def roots(app: FastAPI):
    @app.get("/")
    async def root():
        return {
            "success": True,
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "running"
        }

    # ========================================
    # HEALTH
    # ========================================

    @app.get("/health")
    async def health():
        return {
            "status": "ok",
            "service": "task-menu-api"
        }
