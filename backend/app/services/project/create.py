# app/services/project/create.py

from datetime import datetime, timezone
from fastapi import Depends, HTTPException, status

from app.models.user.user import User
from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService
from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)

from app.models.project.project import ProjectModel
from app.repositories.project.create import ProjectRepositoryCreate
from app.schemas.project.create import ProjectCreate

from app.repositories.project.read import ProjectRepositoryRead
from app.schemas.project.read import ProjectRead


class ProjectServiceCreate:

    def __init__(
        self,
        repository_create: ProjectRepositoryCreate,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository_create = repository_create
        self.user = user
        self.security = security

    async def create(self, data: ProjectCreate) -> ProjectModel:
        """
        Orchestrates secure project container initialization pipelines.
        Validates permission matrices, enforces chronological dependency constraints,
        and handles automatic owner assignment schemas dynamically.
        """

        # ⏳ MUTUAL DATE DEPENDENCY GATE: Enforce strict chronological symmetry across timeline parameters
        has_start_date = data.start_date
        has_due_date = data.due_date

        if (not has_start_date and has_due_date) or (
            has_start_date and not has_due_date
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Chronological Co-dependency Exception: Both Initialization Date and Target Delivery Deadline must be provided together, or both must be omitted.",
            )

        # 🛡️ 1. BASELINE AUTHORIZATION GATE: Verify absolute clearance to instantiate new projects inside the cluster
        self.security.require_permission_dependency.require_permission(
            user=self.user, permission=Permission.PROJECTS_CREATE
        )

        # 👑 2. CONDITIONAL RBAC ASSIGNMENT GATE: Intercept custom operator routing if the target owner differs from the current identity session
        if data.owner_id is not None and data.owner_id != str(self.user.id):
            self.security.require_permission_dependency.require_permission(
                user=self.user, permission=Permission.PROJECTS_ASSIGN_OWNER
            )

        # 📅 3. TIMESTAMP INJECTION: Standardize chronological operational parameters natively across shards
        now = datetime.now(timezone.utc)
        data_model = data.model_dump()

        data_model["created_at"] = now
        data_model["updated_at"] = now

        # Structural schema mapping and automated conversion into the persistent DB storage model object layer
        project_model = ProjectModel.model_validate(data_model)

        # Dispatch the hardened, authenticated payload directly to the MongoDB insertion repository
        return await self.repository_create.create(data=project_model)
