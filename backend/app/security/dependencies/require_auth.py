# app/security/dependencies/require_auth.py

from app.models.user.user import User


class RequireAuthDependency:

    async def require_auth(
        self,
        user: User
    ) -> User:
        """
        Ensure the require is authentication.
        """
        return user
        
