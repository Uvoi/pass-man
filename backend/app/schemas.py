from datetime import datetime

from pydantic import BaseModel


class PasswordItemCreate(BaseModel):
    encrypted_data: str
    iv: str
    salt: str


class PasswordItemUpdate(BaseModel):
    encrypted_data: str
    iv: str
    salt: str


class PasswordItemResponse(BaseModel):
    id: int
    encrypted_data: str
    iv: str
    salt: str
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }