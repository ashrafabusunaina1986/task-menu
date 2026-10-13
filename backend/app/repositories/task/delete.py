# app/repositories/task/delete.py

from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_tasks_collection


class TaskDeleteRepository:

    # =============================
    # ADMIN/PUBLIC
    # =============================
    
    async def delete(
        self,
        task_id: str
    ) -> bool:

        try:

            result = await get_tasks_collection().delete_one(
                {
                    "_id": ObjectId(task_id)
                }
            )

            return result.deleted_count > 0

        except InvalidId:
            return False
    # =============================
    # OWNER 
    # =============================
        
    async def delete_by_user(
            self,
            task_id: str,
            user_id: str
        ) -> bool:
    
            try:
    
                result = await get_tasks_collection().delete_one(
                    {
                        "_id": ObjectId(task_id),
                        "user_id":user_id
                    }
                )
    
                return result.deleted_count > 0
    
            except InvalidId:
                return False