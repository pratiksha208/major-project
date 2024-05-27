# models.py

from sqlalchemy import Column, String, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "sqlite:///./test.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def init_db():
    Base.metadata.create_all(bind=engine)


# Use a thread-local session
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))


class User(Base):
    __tablename__ = "users"

    username = Column(String, unique=True, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

    # Define the relationship with the GeneratedImage model
    generated_images = relationship("GeneratedImage", back_populates="user")


class GeneratedImage(Base):
    __tablename__ = "generated_images"

    id = Column(String, primary_key=True, index=True)
    user_username = Column(String, ForeignKey("users.username"), index=True)
    prompt = Column(String)
    created_at = Column(DateTime, default=func.now())
    url = Column(String)

    # Define the relationship with the User model
    user = relationship("User", back_populates="generated_images")

    