from pydantic import ConfigDict, BaseModel, Field


class StoreInputDTO(BaseModel):
    address: str = Field(..., title="Sol Address", description="Solana address of the user")
    key: str = Field(..., title="Secret Name", description="Name of the secret to store in Nillion")
    value: str | int = Field(..., title="Secret Value", description="Value  to stpre in Nillion. It can be string or integer")
    