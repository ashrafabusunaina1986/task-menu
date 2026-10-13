# app/routes/recaptcha/recaptcha.py

from fastapi import (
    status,
    HTTPException,
    Depends,
    APIRouter,
    Request
)

from app.core.container.recaptcha import get_recaptcha_service
from app.security.recaptcha.service import RecaptchaService

from app.schemas.recaptcha.recaptcha import RecaptchaRequest

router = APIRouter()


@router.post('/')
async def recaptcha(
    data: RecaptchaRequest,
    service: RecaptchaService = Depends(get_recaptcha_service),
):
    valid = await service.verify(
        token=data.recaptcha_token,
        expected_action=data.expected_action
    )
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Security verification failed"
        )
    return {
        "success": True,
        "action": data.expected_action
    }
