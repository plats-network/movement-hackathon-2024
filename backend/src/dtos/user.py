from pydantic import BaseModel, Field
class UpdateAccountDTO(BaseModel):
    public_key: str = Field(..., description="Public key", example="DVivFHaOi2MxinlEe+LJ17HfFUZF999Ruc59Ty5boSs=")
    address: str = Field(..., description="Address", example="BrX9Z85BbmXYMjvvuAWU8imwsAqutVQiDg9uNfTGkzrJ")