# app/routes/project/base.py

class ProjectRouteBase:

    @property
    def project_prefix(self) -> str:
        return "/project"

    @property
    def project_tags(self) -> list[str]:
        return ["PROJECT"]


base = ProjectRouteBase()
