# app/services/task/create.py

from fastapi import HTTPException, status
from datetime import datetime, timezone
from app.services.task.base import TaskServiceBase
from app.schemas.task_schema import TaskCreate
from app.models.user.user import User
from app.models.task import Task
from app.security.permissions.roles import Role
from app.schemas.project.read import ProjectRead


class TaskCreateService(TaskServiceBase):
    """
    Business logic orchestrator for secure task node provisioning.
    Allows administrative overrides for cross-project task allocations.
    """

    async def create(
        self,
        user: User,
        task_data: TaskCreate,
    ) -> dict:
        # 1. Fetch the parent project context profile using the internal base readers
        project = await self.project_service_read.get_project(
            data=ProjectRead(project_id=task_data.project_id)
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Operational Exception: Parent project container node not localized.",
            )

        # 🛡️ Access Control Gate: Execute strict checks only if the actor is NOT a global system ADMIN
        if user.role != Role.ADMIN:
            # Enforce validation: standard users can only append tasks if they own the project container
            if project.owner_id != str(user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Security Clearance Denied: Only the allocated project owner or system administrators can inject tasks.",
                )

            # Double-verify explicit group/member authorization boundaries for non-admin accounts
            await self._check_project_access(user=user, project_id=task_data.project_id)

        # 2. Extract global project lifecycle boundaries for cross-verification
        project_due_date = await self.get_due_date_of_project(
            project_id=task_data.project_id
        )
        project_start_date = await self.get_start_date_of_project(
            project_id=task_data.project_id
        )

        # Get the localized active network timestamp
        now = datetime.now(timezone.utc)

        # 🛡️ Secure Validation Gate: Ensure task completion deadline aligns with the parent project bounds
        if task_data.due_date and project_due_date:
            if task_data.due_date > project_due_date:
                # Block future structural anomalies while safely handling historic containment logging
                if task_data.due_date > now:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Operational Breach: Task deadline cannot extend beyond the global project delivery timeline.",
                    )

        # 🛡️ Secure Validation Gate: Enforce strict initialization containment for the task start date
        if task_data.start_date and project_start_date:
            if task_data.start_date < project_start_date:
                # ✅ FIXED: Validate structural integrity comprehensively rather than blocking active today packets
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Operational Breach: Task initialization date cannot be chronologically earlier than the parent project start date.",
                )

        # 3. Synchronize structural operational logs and payload mappings
        task_model = task_data.model_dump()

        # Inject the active creator footprint into the data capsule packet
        task_model["user_id"] = user.id
        task_model["created_at"] = now
        task_model["updated_at"] = now

        # Enforce strict layout validation against the Pydantic ORM model metadata
        task = Task.model_validate(task_model)

        # Dispatch the clean packet to the database repository persistence layer
        task_id = await self.repository.create(task_data=task)

        return {"message": "Task created successfully", "id": task_id}
