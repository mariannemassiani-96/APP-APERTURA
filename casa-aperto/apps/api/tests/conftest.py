import os

import pytest
from httpx import ASGITransport, Client
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app import db as app_db
from app.main import app
from app.settings import settings


def setup_test_db():
    test_url = os.getenv("DATABASE_URL_TEST", settings.database_url)
    test_engine = create_engine(test_url, pool_pre_ping=True)
    app_db.engine = test_engine
    app_db.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    app_db.Base.metadata.drop_all(bind=test_engine)
    app_db.Base.metadata.create_all(bind=test_engine)
    return test_engine


@pytest.fixture(scope="session", autouse=True)
def _initialize_db():
    setup_test_db()


@pytest.fixture()
def client():
    transport = ASGITransport(app=app)
    with Client(transport=transport, base_url="http://test") as client:
        yield client
