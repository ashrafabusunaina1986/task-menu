# app/routes/email/email.py

from fastapi import Depends, APIRouter

from app.schemas.email.email import EmailRequest
from app.core.container.email import get_email_service
from app.services.email.service import EmailService

router = APIRouter()


@router.post("/send")
async def send_email_public(
    email_data: EmailRequest,
    email_service: EmailService = Depends(get_email_service)
):
    return await email_service.send(
        to=email_data.to,
        subject=email_data.subject,
        detail=email_data.detail,
    )
