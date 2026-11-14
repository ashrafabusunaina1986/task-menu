# app/repositories/team/team_invitation/read.py

from bson import ObjectId

from app.core.database import get_team_invitations_collection

from app.schemas.team.team_invitation.read import (
    TeamInvitationRead,
    TeamInvitationsRead,
)
from app.schemas.team.team_invitation.response import (
    TeamInvitationResponse,
    TeamInvitationsResponse,
)


class TeamInvitationRepositoryRead:

    @property
    def collection(self):
        # Get the MongoDB collection for team invitations.
        return get_team_invitations_collection()

    # Retrieve multiple invitations using optional filters.
    async def get_invitations(
        self,
        data: TeamInvitationsRead | None = None,
    ) -> TeamInvitationsResponse:

        # Initialize an empty query.
        query = {}

        # Apply the provided filters.
        if data is not None:
            if data.team_id is not None:
                query["team_id"] = data.team_id

            if data.inviter_id is not None:
                query["inviter_id"] = data.inviter_id

            if data.invitee_email is not None:
                query["invitee_email"] = data.invitee_email

            if data.role is not None:
                query["role"] = data.role

            if data.status is not None:
                query["status"] = data.status

        # Retrieve matching invitation documents.
        cursor = self.collection.find(query)
        documents = await cursor.to_list(length=None)

        # Convert MongoDB documents into response models.
        invitations = []

        for document in documents:
            document["id"] = str(document.pop("_id"))
            invitations.append(
                TeamInvitationResponse.model_validate(document)
            )

        # Return the invitations and their total count.
        return TeamInvitationsResponse(
            invitations=invitations,
            total=len(invitations),
        )

    # Retrieve a single invitation using search filters.
    async def get_invitation(
        self,
        data: TeamInvitationRead,
    ) -> TeamInvitationResponse | None:

        # Convert the provided filters into a MongoDB query.
        query = data.model_dump(
            exclude_none=True,
            exclude_unset=True,
        )

        # Convert the invitation ID into MongoDB ObjectId.
        if "id" in query:
            invitation_id = query.pop("id")

            if not ObjectId.is_valid(invitation_id):
                return None

            query["_id"] = ObjectId(invitation_id)

        # Find the matching invitation.
        document = await self.collection.find_one(query)

        if document is None:
            return None

        # Convert the MongoDB ID into a string.
        document["id"] = str(document.pop("_id"))

        # Return the validated invitation.
        return TeamInvitationResponse.model_validate(document)