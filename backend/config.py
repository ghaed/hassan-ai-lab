from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ollama_host: str = "http://localhost:11434"
    default_model: str = "deepseek-r1:14b"

    class Config:
        env_file = ".env"


settings = Settings()
