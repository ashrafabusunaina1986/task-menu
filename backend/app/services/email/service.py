# app/services/email/service.py
import resend


from jinja2 import Environment, FileSystemLoader

from app.core.config import settings


class EmailService:

    def __init__(
        self,
    ):
        resend.api_key = settings.RESEND_API_KEY

        self.template_environment = Environment(
            loader=FileSystemLoader(
                "app/templates/email"
            )
        )

    async def send(
        self,
        to: str,
        subject: str,
        detail: str,
    ):

        template = self.template_environment.get_template(
            "public.html"
        )

        html = template.render(
            subject=subject,
            detail=detail
        )

        params: resend.Emails.SendParams = {
            "from": "Security Workora <security@workora.cloud>",
            "to": [to],
            "subject": subject,
            "text": detail,
            "html": html
        }

        return await resend.Emails.send_async(params)

    async def send_otp(
        self,
        email: str,
        otp: str
    ):
        template = self.template_environment.get_template(
            "otp.html"
        )

        html = template.render(
            otp=otp
        )

        params: resend.Emails.SendParams = {
            "from": "Security Workora <security@workora.cloud>",
            "to": [email],
            "subject": "Workora Verification Code",
            "text": f"Your verification code is: {otp}",
            "html": html
        }

        return await resend.Emails.send_async(params)
