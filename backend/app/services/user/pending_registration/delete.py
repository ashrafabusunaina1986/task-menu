# app/services/user/pending_registration/delete.py

from app.repositories.user.pending_registration.delete import PendingRegisterRepositoryDelete


class PendingRegisterServicesDelete:
    def __init__(
        self,
        delete: PendingRegisterRepositoryDelete
    ):
        self.repository_delete = delete

    async def delete_expired_register(self) -> bool:
        return await self.repository_delete.delete_expired_register()

    async def delete_pending_register_id(
        self,
        register_id: str
    ) -> bool:
        return await self.repository_delete.delete_pending_register_id(
            register_id=register_id
        )
