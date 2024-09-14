from pydantic import ConfigDict, BaseModel, Field


class StoreInputDTO(BaseModel):
    plat_id: str = Field(..., title="Plat ID", description="Plat ID of the user", examples=["odin-hoang", "5678", "91011"])
    key: str = Field(..., title="Secret Name", description="Name of the secret to store in Nillion", examples=["volume", "balance", "twitter"])
    value: str | int = Field(..., title="Secret Value", description="Value  to stpre in Nillion. It can be string or integer", examples=[100])


class RetrieveInputDTO(BaseModel):
    plat_id: str = Field(..., title="Plat ID", description="Plat ID of the user", examples=["odin-hoang", "5678", "91011"])
    key: str = Field(..., title="Secret Name", description="Name of the secret to retrieve from Nillion", examples=["volume", "balance", "twitter"])