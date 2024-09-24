from pydantic import BaseModel

class RegisterAppDTO(BaseModel):
    app_name: str
    app_url: str