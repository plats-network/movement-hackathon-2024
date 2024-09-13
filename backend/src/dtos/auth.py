from pydantic import ConfigDict, BaseModel, Field


class RegisterInputDTO(BaseModel):
    eoa: str = Field(..., title="Ethereum Address", description="Ethereum address of the user")
    plat_id: str = Field(..., title="Plat ID", description="Plat ID of the user")
    public_key: str = Field(..., title="Public Key", description="Public key for authentication user is owner of the address")
class LoginInputDTO(BaseModel):
    eoa: str = Field(..., title="Ethereum Address", description="Ethereum address of the user")
    
    
class VerifyRequestDTO(BaseModel):
    public_key: str
    signature: str


class TokenData(BaseModel):
    sub: str = None