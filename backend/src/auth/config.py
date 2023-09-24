from functools import lru_cache

from pydantic import BaseSettings


class JWTSettings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = '.env'

@lru_cache()
def get_jwt_settings():
    return JWTSettings()