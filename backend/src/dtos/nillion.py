from pydantic import ConfigDict, BaseModel, Field
from typing import List

class StoreInputDTO(BaseModel):
    plat_id: str = Field(..., title="Plat ID", description="Plat ID of the user", examples=["khaihoang", ])
    wallet_addr: str = Field(..., title="Wallet Address", description="Wallet address of the user", examples=["GJeggjDKerwUaFpbkL9DnDC2S9C5ez2HEomcb9LjWKJB", ])
    secret_balance: float = Field(..., title="Secret Balance", description="Secret balance of the user", examples=[3728.52, ])
    secret_volume: float = Field(..., title="Secret Volume", description="Secret volume of the user", examples=[46720.81, ])


class RetrieveInputDTO(BaseModel):
    plat_id: str = Field(..., title="Plat ID", description="Plat ID of the user", examples=["khaihoang", ])