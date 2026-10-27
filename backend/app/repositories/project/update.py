
# app/repositories/project/update.py


from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId

from app.schemas.project.update import ProjectUpdate
from app.core.database import get_project_collection


class ProjectRepositoryUpdate:

    @property
    def collection(self):
        return get_project_collection()

    async def update(
        self,
        project_id: str,
        data: ProjectUpdate
    ) -> bool:

        if not project_id:
            return False

        try:
            object_id = ObjectId(project_id)
        except (InvalidId, TypeError):
            return False

        data_model = data.model_dump(
            by_alias=True
        )

        if not data_model:
            return False

        now = datetime.now(timezone.utc)

        updated = await self.collection.update_one(
            {"_id": object_id},
            {"$set": {
                **data_model,
                "updated_at": now
            }
            }
        )

        return updated.matched_count == 1
