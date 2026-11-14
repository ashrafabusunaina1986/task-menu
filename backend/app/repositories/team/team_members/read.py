# app/repositories/team/team_members/read.py

from bson import ObjectId

from app.core.database import get_team_members_collection

from app.schemas.team.team_members.read import (
    TeamMemberRead,
    TeamMembersRead,
)
from app.schemas.team.team_members.response import (
    TeamMemberResponse,
    TeamMembersResponse,
)


class TeamMemberRepositoryRead:

    @property
    def collection(self):
        # Return the team_members MongoDB collection.
        return get_team_members_collection()

    async def get_members(
        self,
        data: TeamMembersRead | None = None,
    ) -> TeamMembersResponse:

        # Initialize an empty MongoDB query.
        query = {}

        # Add search filters when provided.
        if data is not None:

            if data.team_id is not None:
                query["team_id"] = data.team_id

            if data.user_id is not None:
                query["user_id"] = data.user_id

            if data.role is not None:
                query["role"] = data.role

            if data.status is not None:
                query["status"] = data.status

        # Retrieve all matching membership documents.
        cursor = self.collection.find(query)

        # Convert the cursor into a list.
        documents = await cursor.to_list(length=None)

        # Convert MongoDB documents into response objects.
        members = []

        for document in documents:
            document["member_id"] = str(document.pop("_id"))

            members.append(
                TeamMemberResponse.model_validate(document)
            )

        # Return the memberships and their total count.
        return TeamMembersResponse(
            members=members,
            total=len(members),
        )

    async def get_member(
        self,
        data: TeamMemberRead,
    ) -> TeamMemberResponse | None:

        # Build the MongoDB query from the provided filters.
        query = data.model_dump(
            exclude_none=True,
            exclude_unset=True,
        )

        # Convert member_id into MongoDB ObjectId when provided.
        if "member_id" in query:
            member_id = query.pop("member_id")

            if not ObjectId.is_valid(member_id):
                return None

            query["_id"] = ObjectId(member_id)

        # Retrieve one matching membership document.
        document = await self.collection.find_one(query)

        if document is None:
            return None

        # Convert MongoDB ObjectId into a string.
        document["member_id"] = str(document.pop("_id"))

        # Validate and return the membership response.
        return TeamMemberResponse.model_validate(document)