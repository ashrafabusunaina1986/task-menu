# app/routes/email/route.py

from fastapi import APIRouter

from app.routes.email.email import router as send_email_router
from app.routes.email.otp import router as send_otp_email_router

router = APIRouter(
    tags=["SEND EMAIL"]
)


router.include_router(send_email_router)
router.include_router(send_otp_email_router)
