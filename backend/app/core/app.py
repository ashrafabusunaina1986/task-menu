# app/core/app.py

# Import context manager for application startup and shutdown events
from contextlib import asynccontextmanager

from fastapi import FastAPI

# Import middleware and core components
from app.middleware.cors import setup_cors
from app.core.database import MongoDB
from app.core.config import settings
from app.middleware.swagger import setup_swagger_protection

# Import all route modules
from app.routes.task.route import router_task
from app.routes.user.route import router as user_router
from app.routes.auth.route import router as auth_router
from app.routes.profile.route import router as profile_router
from app.routes.recaptcha.route import router as recaptcha_router
from app.routes.email.route import router as send_email_public_router
from app.routes.user_block.route import UserBlockRoute
from app.routes.security_attempts.route import SecurityAttemptsRoute
from app.routes.project.route import project_router
from app.routes.team.team.route import team_router
from app.routes.team.team_members.route import team_members_router
from app.routes.team.team_invitation.route import invitation_router


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application instance.
    Returns:
        FastAPI: Fully configured application ready to run
    """

    @asynccontextmanager
    async def lifecycle(app: FastAPI):
        """
        Application lifecycle manager.
        Runs startup logic before yielding and cleanup logic on shutdown
        """

        # Startup: Establish database connection and initialize indexes
        await MongoDB.connect()
        await MongoDB.create_indexes()

        try:
            # Application is now running and serving requests
            yield
        finally:
            # Cleanup: Close database connection gracefully on shutdown
            MongoDB.close()

    # Initialize main FastAPI application
    app = FastAPI(
        docs_url="/docs",
        openapi_url="/openapi.json",
        redoc_url=None,
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        lifespan=lifecycle,
    )

    # Apply middleware configurations
    setup_cors(app)
    setup_swagger_protection(app)

    # Register all API routes
    register_routes(app)

    # Register root and health check endpoints
    register_root_endpoints(app)

    return app


def register_routes(app: FastAPI) -> None:
    """Register all application route routers"""

    app.include_router(router_task)

    app.include_router(
        user_router,
        prefix="/auth",
    )

    app.include_router(auth_router)
    app.include_router(profile_router)
    app.include_router(recaptcha_router)
    app.include_router(send_email_public_router)
    app.include_router(UserBlockRoute().router)
    app.include_router(SecurityAttemptsRoute().router)
    app.include_router(project_router)
    app.include_router(team_router)
    app.include_router(team_members_router)
    app.include_router(invitation_router)


def register_root_endpoints(app: FastAPI) -> None:
    """Register root path and health check endpoints"""

    @app.get("/")
    async def root():
        """Root endpoint returning basic service information"""
        return {
            "success": True,
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "running",
        }

    # ========================================
    # HEALTH CHECK ENDPOINT
    # ========================================
    @app.get("/health")
    async def health():
        """Health check endpoint for monitoring and uptime checks"""
        return {"status": "ok", "service": settings.APP_NAME}
