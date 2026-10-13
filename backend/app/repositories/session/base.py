# app/repositories/session/base.py

from app.core.database import get_sessions_collection


class SessionRepositoryBase:
    
    def __init__(self):

        self.collection = get_sessions_collection()
