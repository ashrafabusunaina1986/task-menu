# app/schemas/recaptcha/recaptcha.py

from pydantic import BaseModel, Field


class RecaptchaRequest(BaseModel):
    recaptcha_token: str = Field(
        min_length=1
    )
    expected_action: str
