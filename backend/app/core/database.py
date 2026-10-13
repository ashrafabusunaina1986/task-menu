# app/core/database.py

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError, PyMongoError
from app.core.config import settings


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db = None
    _connected: bool = False

    @classmethod
    async def connect(cls, retries: int = 10, delay: int = 1):

        if not settings.MONGO_URI:
            raise ValueError("MONGO_URI is not defined")

        cls.client = AsyncIOMotorClient(
            settings.MONGO_URI,
            serverSelectionTimeoutMS=3000,
            uuidRepresentation="standard",
            tz_aware=True
        )

        last_error = None

        for attempt in range(1, retries + 1):
            try:
                # تأكيد الاتصال الحقيقي
                await cls.client.admin.command("ping")

                cls.db = cls.client.get_database(settings.DB_NAME)
                cls._connected = True

                print(f"MongoDB connected ✔ (attempt {attempt})")
                return

            except ServerSelectionTimeoutError as e:
                last_error = e
                print(f"[Mongo retry {attempt}/{retries}] timeout: {e}")

            except PyMongoError as e:
                last_error = e
                print(f"[Mongo retry {attempt}/{retries}] mongo error: {e}")

            except Exception as e:
                last_error = e
                print(f"[Mongo retry {attempt}/{retries}] unknown error: {e}")

            await asyncio.sleep(delay)

        cls._connected = False
        cls.client = None
        cls.db = None

        raise RuntimeError(f"Mongo failed after retries: {last_error}")

    @classmethod
    def close(cls):
        if cls.client:
            cls.client.close()

        cls.client = None
        cls.db = None
        cls._connected = False


# =========================
# SAFE ACCESS LAYER
# =========================

def get_db():
    if MongoDB.db is None:
        raise RuntimeError(
            "Database not initialized (MongoDB.connect not completed)")
    return MongoDB.db


def get_tasks_collection():
    return get_db().get_collection("tasks")


def get_users_collection():
    return get_db().get_collection("users")


def get_sessions_collection():
    return get_db().get_collection("sessions")


def get_user_block_collection():
    return get_db().get_collection("user_block")


def get_security_attempts_collection():
    return get_db().get_collection("security_attempts")


def get_otp_collection():
    return get_db().get_collection("otp")


def get_login_collection():
    return get_db().get_collection("login")


def get_register_collection():
    return get_db().get_collection("register")


def get_pending_register_collection():
    return get_db().get_collection("pending_register")


def get_resend_otp_collection():
    return get_db().get_collection("resend_otp")
