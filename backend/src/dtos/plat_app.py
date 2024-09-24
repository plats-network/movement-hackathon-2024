from pydantic import BaseModel, Field
from typing import Optional
class RegisterAppDTO(BaseModel):
    app_name: str  = Field(..., description="App name", example="Plat App 1")
    app_url: str = Field(..., description="App URL", example="https://platapp1.com")
    app_icon: str = Field(None, description="App Icon URL", example="https://platapp1.com/icon.png")
    
    
class UpdateAppDTO(BaseModel):
    app_id: str = Field(..., description="App ID", example="e0fae6c17f495cdad6b210afe0ce993a6fa70c7fba5ef65ed27677ec032e4cf")