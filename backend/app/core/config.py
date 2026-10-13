# app/core/config.py

import os
from dataclasses import dataclass
from dotenv import load_dotenv

from pydantic import SecretStr

load_dotenv()


@dataclass
class Settings:
    APP_NAME: str = "Task Menu API"
    APP_VERSION: str = "1.0.0"

    JWT_ALGORITHM = "HS256"

    JWT_ISSUER = "sbm-security-api"

    JWT_AUDIENCE = "sbm-client"

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY"
    )
    MONGO_URI: str = os.getenv(
        "MONGO_URI"
    )

    DB_NAME: str = os.getenv(
        "DB_NAME"
    )

    GOOGLE_CLIENT_ID: str = os.getenv(
        "GOOGLE_CLIENT_ID"
    )

    RECAPTCHA_SECRET_KEY: str = os.getenv(
        "RECAPTCHA_SECRET_KEY"
    )

    RESEND_API_KEY: str = os.getenv(
        "RESEND_API_KEY"
    )

    OTP_SECRET: SecretStr = SecretStr(os.getenv(
        "OTP_SECRET"
    ))

    SWAGGER_USERNAME: SecretStr = SecretStr(os.getenv(
        "SWAGGER_USERNAME"
    ))

    SWAGGER_PASSWORD: SecretStr = SecretStr(os.getenv(
        "SWAGGER_PASSWORD"
    ))


settings = Settings()
