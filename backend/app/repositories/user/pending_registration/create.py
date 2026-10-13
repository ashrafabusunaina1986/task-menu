# app/repositories/user/pending_registration/create.py


from app.models.user.pending_registration import (
    PendingRegistrationModel
)

from app.core.database import get_pending_register_collection


class PendingRegisterRepositoryCreate:

    async def create(
        self,
        data: PendingRegistrationModel
    ) -> PendingRegistrationModel:

        data_model = data.model_dump(
            mode="python",
            by_alias=True,
            exclude={"id"}
        )

        pending_register = await get_pending_register_collection().insert_one(
            data_model
        )

        data_model["_id"] = str(
            pending_register.inserted_id
        )

        return PendingRegistrationModel.model_validate(
            data_model
        )
