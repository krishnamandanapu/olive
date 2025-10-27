from pydantic import BaseModel, HttpUrl

class Dog(BaseModel):
    breed: str
    image: HttpUrl | None = None
