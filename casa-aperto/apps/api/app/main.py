from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.logging_conf import setup_logging
from app.routers import admin, auth, projects
from app.settings import settings

logger = setup_logging(settings.log_level)

app = FastAPI(title="Casa Aperto PRO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(admin.router)


@app.on_event("startup")
def on_startup():
    logger.info("startup", message="API starting")


@app.get("/health")
def health():
    return {"status": "ok"}
