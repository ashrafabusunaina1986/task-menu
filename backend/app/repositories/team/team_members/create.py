# app/repositories/team/team_members/create.py

from app.core.database import get_team_members_collection
from app.models.team.team_member import TeamMemberModel
from app.schemas.team.team_members.response import TeamMemberResponse


class TeamMemberRepositoryCreate:

    @property
    def collection(self):
        # Return the team_members MongoDB collection.
        return get_team_members_collection()

    async def create(
        self,
        data: TeamMemberModel,
    ) -> TeamMemberResponse:

        # Convert the model into a MongoDB-compatible dictionary.
        document = data.model_dump(
            mode="python",
            by_alias=True,
            exclude={"id"},
        )

        # Insert the membership document into MongoDB.
        result = await self.collection.insert_one(document)

        # Convert the MongoDB ObjectId into a string.
        document["member_id"] = str(result.inserted_id)

        # Validate and return the created membership.
        return TeamMemberResponse.model_validate(document)
