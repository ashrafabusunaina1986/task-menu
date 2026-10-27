
# app/repositories/project/read.py

from app.models.project.project import ProjectModel
from app.schemas.project.read import ProjectRead

from app.core.database import get_project_collection

from bson import ObjectId
from bson.errors import InvalidId


class ProjectRepositoryRead:

    @property
    def collection(self):
        return get_project_collection()

    async def get_projects(
        self,
    ) -> list[ProjectModel]:
        pipeline = [
            {
                "$addFields": {
                    "owner_object_id": {
                        "$convert": {
                            "input": "$owner_id",
                            "to": "objectId",
                            "onError": None,
                            "onNull": None,
                        }
                    }
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner_object_id",
                    "foreignField": "_id",
                    "pipeline": [
                        {
                            "$project": {
                                "_id": 0,
                                "role": 1
                            }
                        }
                    ],
                    "as": "owner"
                }
            },
            {
                "$addFields": {
                    "owner_role": {
                        "$ifNull": [
                            {"$arrayElemAt": ["$owner.role", 0]},
                            None
                        ]
                    }
                }
            },
            {
                "$project": {
                    "owner": 0,
                    "owner_object_id": 0
                }
            }
        ]
        cursor = self.collection.aggregate(pipeline=pipeline)

        projects = await cursor.to_list(length=None)

        result: list[ProjectModel] = []

        for project in projects:
            project["_id"] = str(project["_id"])
            result.append(ProjectModel.model_validate(project))

        return result

    async def get_project(
        self,
        data: ProjectRead
    ) -> ProjectModel | None:

        data_model = data.model_dump(
            exclude_unset=True,
            exclude_none=True,
            by_alias=True
        )

        project_id = data_model.pop("project_id", None)

        if project_id is not None:
            try:
                data_model["_id"] = ObjectId(project_id)
            except (InvalidId, TypeError):
                return None

        if not data_model:
            return None

        project = await self.collection.find_one(
            data_model
        )
        print("PROJECT FOUND:", project is not None)
        if project is None:
            return None

        project["_id"] = str(project["_id"])

        return ProjectModel.model_validate(project)

    async def get_projects_by_user(
        self,
        user_id: str
    ) -> list[ProjectModel]:

        if not user_id:
            return []

        cursor = self.collection.find({
            "owner_id": user_id
        })

        projects = await cursor.to_list(length=None)

        result: list[ProjectModel] = []

        for project in projects:
            project["_id"] = str(project["_id"])

            result.append(
                ProjectModel.model_validate(project)
            )

        return result
