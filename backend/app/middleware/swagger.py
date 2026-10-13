
# app/core/middleware/swagger.py

import secrets

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from app.core.config import settings


SWAGGER_PATHS = {
    "/docs",
    "/openapi.json",
}

swagger_auth = HTTPBasic(auto_error=False)


async def protect_swagger(
    request: Request,
    call_next,
):
    if request.url.path not in SWAGGER_PATHS:
        return await call_next(request)

    credentials: HTTPBasicCredentials | None = (
        await swagger_auth(request)
    )

    if credentials is None:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Swagger authentication required"},
            headers={
                "WWW-Authenticate": 'Basic realm="Swagger"',
            },
        )

    username_ok = secrets.compare_digest(
        credentials.username.encode("utf-8"),
        settings.SWAGGER_USERNAME.get_secret_value().encode("utf-8"),
    )

    password_ok = secrets.compare_digest(
        credentials.password.encode("utf-8"),
        settings.SWAGGER_PASSWORD.get_secret_value().encode("utf-8"),
    )

    if not (username_ok and password_ok):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Invalid Swagger credentials"},
            headers={
                "WWW-Authenticate": 'Basic realm="Swagger"',
            },
        )

    return await call_next(request)


def setup_swagger_protection(app: FastAPI):
    app.middleware("http")(protect_swagger)
