# app/repositories/project/create.py

from app.models.project.project import ProjectModel

from app.core.database import get_project_collection


class ProjectRepositoryCreate:

    @property
    def collection(self):
        return get_project_collection()

    async def create(
        self,
        data: ProjectModel
    ) -> ProjectModel:

        data_model = data.model_dump(
            exclude={"id"},
            by_alias=True,
            mode='python'
        )

        record_project = await self.collection.insert_one(
            data_model
        )

        data_model["_id"] = str(
            record_project.inserted_id
        )

        return ProjectModel.model_validate(
            data_model
        )
