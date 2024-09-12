from pydantic import ConfigDict, BaseModel, Field


class RegisterInputDTO(BaseModel):
    eoa: str = Field(..., title="Ethereum Address", description="Ethereum address of the user")
    plat_id: str = Field(..., title="Plat ID", description="Plat ID of the user")
    
class LoginInputDTO(BaseModel):
    eoa: str = Field(..., title="Ethereum Address", description="Ethereum address of the user")
    
    
class VerifyRequestDTO(BaseModel):
    publicKey: str
    signature: str


class TokenData(BaseModel):
    sub: str = None