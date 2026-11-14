# app/repositories/team/team_invitation/create.py

from app.core.database import get_team_invitations_collection

from app.models.team.team_invitation import TeamInvitationModel
from app.schemas.team.team_invitation.response import TeamInvitationResponse


class TeamInvitationRepositoryCreate:

    @property
    def collection(self):
        # Get the MongoDB collection for team invitations.
        return get_team_invitations_collection()

    # Create a new team invitation in MongoDB.
    async def create(
        self,
        data: TeamInvitationModel,
    ) -> TeamInvitationResponse:

        # Convert the Pydantic model into a MongoDB document.
        document = data.model_dump(
            mode="python",
            by_alias=True,
            exclude={"id"},
        )

        # Insert the invitation document into MongoDB.
        result = await self.collection.insert_one(document)

        # Add the generated MongoDB ID to the response data.
        document["id"] = str(result.inserted_id)

        # Validate and return the created invitation.
        return TeamInvitationResponse.model_validate(document)