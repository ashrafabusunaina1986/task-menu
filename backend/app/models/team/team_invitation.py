

# app/models/team/team_invitation.py

from datetime import datetime, timedelta, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

TeamInvitationRole = Literal["admin", "member"]

TeamInvitationStatus = Literal[
    "pending",
    "accepted",
    "rejected",
    "expired",
    "cancelled",
]


class TeamInvitationModel(BaseModel):
    id: str | None = Field(default=None, alias="_id")

    team_id: str
    inviter_id: str
    invitee_email: EmailStr

    role: TeamInvitationRole = "member"
    status: TeamInvitationStatus = "pending"

    expires_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=7)
    )
    responded_at: datetime | None = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
        validate_assignment=True,
        from_attributes=True,
        str_strip_whitespace=True,
    )
