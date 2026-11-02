# app/services/project/create.py

from datetime import datetime, timezone
from fastapi import Depends

from app.models.user.user import User
from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService
from app.core.container.security import get_security_service, get_current_user_dependency

from app.models.project.project import ProjectModel
from app.repositories.project.create import ProjectRepositoryCreate
from app.schemas.project.create import ProjectCreate


class ProjectServiceCreate:

    def __init__(
        self,
        repository_create: ProjectRepositoryCreate,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service)
    ):
        self.repository_create = repository_create
        self.user = user
        self.security = security

    async def create(
        self,
        data: ProjectCreate
    ) -> ProjectModel:
        """
        Orchestrates secure project container initialization pipelines.
        Validates permission matrices and enforces owner assignment constraints dynamically.
        """
        # 1. جدار حماية الصلاحيات الأساسي: التحقق من امتلاك صلاحية إنشاء المشاريع داخل المنظومة
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.PROJECTS_CREATE
        )

        # 2. جدار حماية التعيين المشروط: التحقق من صلاحية تعيين مالك مخصص في حال تغيير المعرف عن المالك الحالي
        if data.owner_id is not None and data.owner_id != str(self.user.id):
            self.security.require_permission_dependency.require_permission(
                user=self.user,
                permission=Permission.PROJECTS_ASSIGN_OWNER
            )

        # 3. صب وتأمين الطوابع الزمنية القياسية للبيانات
        now = datetime.now(timezone.utc)
        data_model = data.model_dump()

        data_model["created_at"] = now
        data_model["updated_at"] = now

        # التحقق الهيكلي من الكائن والتحويل المباشر للـ ORM Model
        project = ProjectModel.model_validate(data_model)

        # حقن وتخزين كبسولة البيانات في مستودع الحفظ النهائي لـ MongoDB
        return await self.repository_create.create(
            data=project
        )
