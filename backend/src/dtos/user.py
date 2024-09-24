from pydantic import BaseModel, Field
class UpdateAccountDTO(BaseModel):
    public_key: str = Field(..., description="Public key", example="DVivFHaOi2MxinlEe+LJ17HfFUZF999Ruc59Ty5boSs=")
    address: str = Field(..., description="Address", example="BrX9Z85BbmXYMjvvuAWU8imwsAqutVQiDg9uNfTGkzrJ")
    
class UpdatePermissionDTO(BaseModel):
    permissions: list = Field(..., description="Permissions", example=["b756dcdfee39567eb4d62fa032a03c8e7c10e4a0ee80b780bd2fe1720d0592f8", "94e5d95685a0bcc606cce3034fe2f67e04692253fa5f15d557263f8b3e7a2806"])