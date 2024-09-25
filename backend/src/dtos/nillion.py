from pydantic import ConfigDict, BaseModel, Field
from typing import List

class StoreInputDTO(BaseModel):
    plat_id: str = Field(..., title="Plat ID", description="Plat ID of the user", examples=["khaihoang", ])
    balances: List[float] = Field(..., title="Balances", description="List of balances", examples=[[20.60924, 9709.224]])
    volumes: List[float] = Field(..., title="Volumes", description="List of volumes", examples=[[1520.24, 55520.224]])


class RetrieveInputDTO(BaseModel):
    plat_id: str = Field(..., title="Plat ID", description="Plat ID of the user", examples=["khaihoang", ])