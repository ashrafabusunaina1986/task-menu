# app/models/session/session.py

from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class SessionModel(BaseModel):

    id: str | None = Field(
        default=None,
        alias="_id"
    )

    user_id: str

    refresh_token: str

    device: str | None = None

    ip_address: str | None = None

    active: bool = True

    created_at: datetime

    revoked_at: datetime | None = None

    model_config = ConfigDict(
        populate_by_name=True
    )
