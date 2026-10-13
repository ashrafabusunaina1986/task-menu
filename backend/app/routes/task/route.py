# app/routes/task/route.py

from fastapi import APIRouter

from app.routes.task.create import router as create_router
from app.routes.task.read import router as read_router
from app.routes.task.update import router as update_router
from app.routes.task.delete import router as delete_router


router_task = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

router_task.include_router(create_router)
router_task.include_router(read_router)
router_task.include_router(update_router)
router_task.include_router(delete_router)