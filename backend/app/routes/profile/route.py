# app/routes/route.py

from fastapi import APIRouter
from app.routes.profile.read import profile_router

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

router.include_router(profile_router)
