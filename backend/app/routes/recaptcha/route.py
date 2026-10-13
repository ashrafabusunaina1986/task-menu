# app/routes/recaptcha/route.py
from fastapi import APIRouter

from app.routes.recaptcha.recaptcha import router as recaptcha_router

router = APIRouter(
    prefix="/recaptcha",
    tags=["Recaptcha"]
)

router.include_router(recaptcha_router)
