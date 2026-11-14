
# app/repositories/team/team_members/reactivate.py

from datetime import datetime, timezone

from app.core.database import get_team_members_collection

from app.schemas.team.team_members.response import TeamMemberResponse


class TeamMemberRepositoryReactivate:

    @property
    def collection(self):
        return get_team_members_collection()

    async def reactivate(
        self,
        team_id: str,
        user_id: str,
    ) -> TeamMemberResponse | None:

        # 1. Prepare update timestamp
        now = datetime.now(timezone.utc)

        # 2. Reactivate the removed membership
        document = await self.collection.find_one_and_update(
            {
                "team_id": team_id,
                "user_id": user_id,
                "status": "removed",
            },
            {
                "$set": {
                    "status": "active",
                    "joined_at": now,
                    "updated_at": now,
                }
            },
            return_document=True,
        )

        # 3. Return None if no removed membership was found
        if document is None:
            return None

        # 4. Convert MongoDB ObjectId into a string
        document["member_id"] = str(document.pop("_id"))

        # 5. Validate and return the reactivated membership
        return TeamMemberResponse.model_validate(document)
