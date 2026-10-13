# app/security/exceptions/permission.py

from fastapi import HTTPException, status


class PermissionException:

    @staticmethod
    def access_denied() -> None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied."
        )

    @staticmethod
    def permission_denied() -> None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied."
        )
