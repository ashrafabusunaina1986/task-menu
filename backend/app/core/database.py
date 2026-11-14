# app/core/database.py

import asyncio
from typing import Optional

# Asynchronous MongoDB connection tools
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
    AsyncIOMotorDatabase,
)

# MongoDB connection and operation error types
from pymongo.errors import ServerSelectionTimeoutError, PyMongoError

# ASCENDING for index creation
from pymongo import ASCENDING

from app.core.config import settings


class MongoDB:
    """Manages MongoDB connection, initialization, and index setup."""

    # Main MongoDB client instance
    client: Optional[AsyncIOMotorClient] = None

    # Database instance used by the application
    db: Optional[AsyncIOMotorDatabase] = None

    # Connection status flag
    _connected: bool = False

    @classmethod
    async def connect(cls, retries: int = 10, delay: int = 1) -> None:
        """
        Establish connection to MongoDB with automatic retries.

        Args:
            retries: Maximum number of connection attempts
            delay: Seconds to wait between attempts
        """
        if not settings.MONGO_URI:
            raise ValueError("MONGO_URI is not defined in configuration")

        # Initialize MongoDB client
        cls.client = AsyncIOMotorClient(
            settings.MONGO_URI,
            serverSelectionTimeoutMS=3000,  # 3-second timeout
            uuidRepresentation="standard",
            tz_aware=True,
        )

        last_error: Optional[Exception] = None

        # Attempt connection with retries
        for attempt in range(1, retries + 1):
            try:
                # Verify connection with ping
                await cls.client.admin.command("ping")

                # Set database reference
                cls.db = cls.client.get_database(settings.DB_NAME)
                cls._connected = True

                print(f"✅ MongoDB connected (attempt {attempt}/{retries})")
                return

            except ServerSelectionTimeoutError as e:
                last_error = e
                print(f"⚠️  [{attempt}/{retries}] Server selection timeout: {e}")

            except PyMongoError as e:
                last_error = e
                print(f"⚠️  [{attempt}/{retries}] MongoDB error: {e}")

            except Exception as e:
                last_error = e
                print(f"⚠️  [{attempt}/{retries}] Unexpected error: {e}")

            await asyncio.sleep(delay)

        # All attempts failed — reset state and raise error
        cls._connected = False
        cls.client = None
        cls.db = None
        raise RuntimeError(
            f"❌ MongoDB connection failed after {retries} attempts: {last_error}"
        )

    @classmethod
    def close(cls) -> None:
        """Close the database connection and reset state."""
        if cls.client:
            cls.client.close()

        cls.client = None
        cls.db = None
        cls._connected = False
        print("🔌 MongoDB connection closed")

    @classmethod
    def is_connected(cls) -> bool:
        """Return current connection status."""
        return cls._connected

    @classmethod
    async def create_indexes(cls) -> None:
        """Create all database indexes for collections."""
        if cls.db is None:
            raise RuntimeError("Database not initialized — call connect() first")

        # ==========================================
        # TEAMS Collection
        # ==========================================
        teams = cls.db.get_collection("teams")

        await teams.create_index(
            [("project_id", ASCENDING)],
            unique=True,
            name="uq_teams_project_id",
        )

        await teams.create_index(
            [("owner_id", ASCENDING), ("status", ASCENDING)],
            name="idx_teams_owner_status",
        )

        await teams.create_index(
            [("name", ASCENDING)],
            name="idx_teams_name",
        )

        # ==========================================
        # TEAM MEMBERS Collection
        # ==========================================
        team_members = cls.db.get_collection("team_members")

        await team_members.create_index(
            [("user_id", ASCENDING)],
            unique=True,
            partialFilterExpression={"status": "active"},
            name="uq_team_members_active_user",
        )

        await team_members.create_index(
            [("team_id", ASCENDING), ("user_id", ASCENDING)],
            unique=True,
            name="uq_team_members_team_user",
        )

        await team_members.create_index(
            [("team_id", ASCENDING), ("status", ASCENDING)],
            name="idx_team_members_team_status",
        )

        await team_members.create_index(
            [("user_id", ASCENDING)],
            name="idx_team_members_user",
        )

        # ==========================================
        # TEAM INVITATIONS Collection
        # ==========================================
        team_invitations = cls.db.get_collection("team_invitations")

        await team_invitations.create_index(
            [("team_id", ASCENDING), ("status", ASCENDING)],
            name="idx_team_invitations_team_status",
        )

        await team_invitations.create_index(
            [("invitee_email", ASCENDING), ("status", ASCENDING)],
            name="idx_team_invitations_email_status",
        )

        await team_invitations.create_index(
            [("inviter_id", ASCENDING)],
            name="idx_team_invitations_inviter",
        )

        print("✅ All MongoDB indexes created successfully")


# =============================================
# DATABASE ACCESS LAYER
# =============================================


def get_db() -> AsyncIOMotorDatabase:
    """
    Get the initialized database instance.

    Raises:
        RuntimeError: If database is not connected
    """
    if MongoDB.db is None:
        raise RuntimeError("Database not initialized — call MongoDB.connect() first")
    return MongoDB.db


# =============================================
# COLLECTION ACCESSORS
# =============================================


def get_tasks_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("tasks")


def get_users_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("users")


def get_sessions_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("sessions")


def get_user_block_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("user_block")


def get_security_attempts_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("security_attempts")


def get_otp_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("otp")


def get_login_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("login")


def get_register_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("register")


def get_pending_register_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("pending_register")


def get_resend_otp_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("resend_otp")


def get_project_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("project")


def get_team_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("teams")


def get_team_members_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("team_members")


def get_team_invitations_collection() -> AsyncIOMotorCollection:
    return get_db().get_collection("team_invitations")
