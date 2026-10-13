# app/security/auth/google.py

from app.services.user.service import UserService
from app.schemas.user.update import UserUpdate
from app.services.user.google_create import GoogleUserCreateService
from app.services.user_block.service import UserBlockService

from app.security.token.service import TokenService
from app.security.session.service import SessionService
from app.security.token.google_verifier import GoogleTokenVerifier

from app.schemas.user_block.read import (
    UserBlockRead
)
from app.schemas.user_block.base import (
    BlockType
)


class GoogleAuthService:

    def __init__(
        self,
        user_service: UserService,
        user_block_service: UserBlockService,
        google_user_create_service: GoogleUserCreateService,
        google_token_verifier: GoogleTokenVerifier,
        token_service: TokenService,
        session_service: SessionService
    ):
        self.user_service = user_service
        self.user_block_service = user_block_service
        self.google_user_create_service = google_user_create_service
        self.google_token_verifier = google_token_verifier
        self.token_service = token_service
        self.session_service = session_service

    async def authenticate(
        self,
        google_token: str,
        device_id: str | None = None,
        ip_id: str | None = None
    ) -> dict:
        payload = self.google_token_verifier.verify(
            token=google_token
        )

        google_id = payload["sub"]
        email = payload["email"]
        name = payload.get("name") or email.split("@")[0]
        image = payload.get("picture")

        user = await self.user_service.get_by_email(
            email=email
        )

        # ---------------------------------------
        # USER DOES NOT EXIST
        # =======================================

        if not user:
            # Google users do not authenticate with
            # a local password.

            # Therefore this part requires a dedicated
            # Google-user creation flow
            user_id = await self.google_user_create_service.create(
                name=name,
                email=email,
                google_id=google_id,
                image=image
            )
            user = await self.user_service.get_by_id(
                user_id=user_id
            )
        if not user:
            raise ValueError(
                "Failed to create or retrieve Google user"
            )

        user_block = await self.user_block_service.get_active_block(
            data=UserBlockRead(
                user_id=user.id,
                block_type=BlockType.USER
            )
        )
        print("GOOGLE USER ID:", repr(user.id))
        print("GOOGLE USER BLOCK:", user_block)
        if user_block:
            return {
                "blocked": True,
                "reason": user_block.reason,
                "blocked_until": user_block.blocked_until
            }

        # ----------------
        # is verified
        # ----------------
        await self.user_service.update(
            user_id=user.id,
            data=UserUpdate(
                is_verified=True
            )
        )
        user = await self.user_service.get_by_email(
            email=email
        )
        # -------------------------------------
        # USER EXISTS
        # -------------------------------------

        access_token = self.token_service.create_access_token(
            user_id=user.id
        )

        refresh_token = self.token_service.create_refresh_token(
            user_id=user.id
        )

        session_id = await self.session_service.create.create(
            user_id=user.id,
            refresh_token=refresh_token,
            device=device_id,
            ip_address=ip_id
        )

        return {
            "user": user,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "session_id": session_id
        }
