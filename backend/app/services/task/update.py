# app/services/task/update.py

from fastapi import HTTPException, status
from datetime import datetime, timezone
from app.services.task.base import TaskServiceBase
from app.security.permissions.roles import Role
from app.models.user.user import User
from app.schemas.project.read import ProjectRead


class TaskUpdateService(TaskServiceBase):
    """
    Business logic orchestrator for secure task node mutation operations.
    Validates updated timeline intervals against parent project boundary parameters.
    """

    async def update(
        self, task_id: str, project_id: str, user: User, data: dict
    ) -> dict:
        # 1. Fetch the parent project context profile using the internal base readers
        project = await self.project_service_read.get_project(
            data=ProjectRead(project_id=project_id)
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Operational Exception: Parent project container node not localized.",
            )

        # Access Control Gate: Execute strict checks only if the actor is NOT a global system ADMIN
        if user.role != Role.ADMIN:
            # Enforce validation: standard users can only mutate tasks if they own the project container
            if project.owner_id != str(user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Security Clearance Denied: Only the allocated project owner or system administrators can modify tasks.",
                )

            # Double-verify explicit group/member authorization boundaries for non-admin accounts
            await self._check_project_access(user=user, project_id=project_id)

        # Normalize existing database project dates to prevent mixed timezone comparison failures
        project_due_date = project.due_date
        project_start_date = project.start_date


        # Safely extract updated date parameters from the partial mutation payload dictionary
        updated_due_date = data.get("due_date").replace(tzinfo=timezone.utc)
        updated_start_date = data.get("start_date").replace(tzinfo=timezone.utc)

        # Capture current system time and strip its timezone info to match the naive DB architecture
        now = datetime.now(timezone.utc)

        # 🛡️ Secure Validation Gate: Convert ISO strings and strip timezone information to avoid raw TypeError desyncs
        if updated_due_date and project_due_date:

            if updated_due_date > project_due_date:
                if updated_due_date > now:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Operational Breach: Updated task deadline cannot extend beyond the global project delivery timeline.",
                    )

        # 🛡️ Secure Validation Gate: Sanitize updated start date criteria cleanly
        if updated_start_date and project_start_date:

            if updated_start_date < project_start_date:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Operational Breach: Updated task initialization date cannot be chronologically earlier than the parent project start date.",
                )

        # 3. Route persistency transactions conditionally based on corporate clearance roles
        if user.role == Role.ADMIN:
            result = await self.repository.update(
                task_id=task_id, data=data, project_id=project_id
            )
        else:
            result = await self.repository.update_by_user(
                task_id=task_id, user_id=user.id, data=data, project_id=project_id
            )

        # 4. Enforce strict database response validations
        if result is None or result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Operational Exception: Target task reference container node not localized inside this cluster zone.",
            )

        return {"message": "Task updated successfully"}
