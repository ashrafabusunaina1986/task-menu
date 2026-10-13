# app/schemas/user/google.py


from pydantic import BaseModel, Field

class GoogleLogin(BaseModel):
    id_token:str=Field(
        min_length=1
    )