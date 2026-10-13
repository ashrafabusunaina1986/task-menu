# app/routes/user/route.py

from fastapi import APIRouter

from app.routes.user.read import router as read_router
from app.routes.user.update import router as update_router
from app.routes.user.delete import router as delete_router


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


router.include_router(read_router)
router.include_router(update_router)
router.include_router(delete_router)