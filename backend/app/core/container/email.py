# app/core/container/email.py

from app.services.email.service import EmailService

def get_email_service()->EmailService:
    return EmailService()