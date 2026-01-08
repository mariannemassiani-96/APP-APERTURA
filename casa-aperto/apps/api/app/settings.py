from __future__ import annotations

from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = Field(alias="DATABASE_URL")
    jwt_secret: str = Field(alias="JWT_SECRET")
    jwt_access_minutes: int = Field(default=30, alias="JWT_ACCESS_MINUTES")
    jwt_refresh_days: int = Field(default=14, alias="JWT_REFRESH_DAYS")
    cors_origins: List[str] = Field(default_factory=list, alias="CORS_ORIGINS")
    cookie_secure: bool = Field(default=False, alias="COOKIE_SECURE")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    @classmethod
    def parse_env_var(cls, field_name: str, raw_value: str):
        if field_name == "cors_origins":
            return [origin.strip() for origin in raw_value.split(",") if origin.strip()]
        if field_name == "cookie_secure":
            return raw_value.lower() in {"1", "true", "yes", "on"}
        return raw_value


settings = Settings()
