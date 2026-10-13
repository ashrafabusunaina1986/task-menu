# app/routes/auth/route.py

from fastapi import APIRouter

from app.routes.auth.register import router as register_router
from app.routes.auth.login import router as login_router
from app.routes.auth.logout import router as logout_router
from app.routes.auth.refresh import router as refresh_router
from app.routes.auth.google import router as google_router

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

router.include_router(register_router)
router.include_router(login_router)
router.include_router(logout_router)
router.include_router(refresh_router)
router.include_router(google_router)
