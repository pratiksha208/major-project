# main.py

from fastapi import FastAPI, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from api.models.models import Base, engine
from api.models.models import GeneratedImage
from api.models.models import User, SessionLocal
from passlib.context import CryptContext  # For password hashing
from typing import Generator
from PIL import Image
from fastapi.staticfiles import StaticFiles
import os
import io
import datetime
import requests
from pydantic import BaseModel
from typing import List
from . import models
# Get the absolute path of the directory containing main.py
directory_path = os.path.dirname(os.path.abspath(__file__))

# Specify the directory path for serving static files
images_directory = os.path.join(directory_path, "images")

app = FastAPI()
# Use the absolute path in the app.mount function
app.mount("/api/images", StaticFiles(directory=images_directory), name="images")
origins = [
    '*',
    "http://localhost",
    "http://localhost:5173",  # Add the specific address of your frontend
]
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2PasswordBearer for handling token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# API Inference details
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": "Bearer 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"}

Base.metadata.create_all(bind=engine)

# Dependency to get the database session

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to query the model

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

# Function to process and save the image

def process_and_save_image(image_bytes, image_name):
    try:
        image_pil = Image.open(io.BytesIO(image_bytes))
        relative_path = f'api/images/{image_name}.png'
        save_path = os.path.join(os.getcwd(), relative_path)
        image_pil.save(save_path)

        return f'/{relative_path}'
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing image: {str(e)}")

class RegisterUser(BaseModel):
    username: str
    email: str
    password: str

class LoginUser(BaseModel):
    username: str
    password: str

# User registration

@app.post("/register")
async def register_user(user_data: RegisterUser, db: Session = Depends(get_db)):
    # Check for Error happens when username is unique but email is not and fix
    print(
        f"Received data: username={user_data.username}, email={user_data.email}, password={user_data.password}")
    # Check if user already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=400, detail="Username already registered")

    # Hash the password before saving to the database
    hashed_password = pwd_context.hash(user_data.password)

    new_user = User(username=user_data.username,
                    email=user_data.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}

# User authentication

@app.post("/login")
async def login_user(user_data: LoginUser, db: Session = Depends(get_db)):
    # TODO - use LoginUser class instead of Form. Check register user for more details
    user = db.query(User).filter(User.username == user_data.username).first()

    if not user or not pwd_context.verify(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}
# Routes


@app.get("/")
async def read_root():
    return {"message": "Text to Image API"}


class Prompt(BaseModel):
    username: str
    prompt: str


@app.post("/process-image")
async def process_image(
    prompt: Prompt,
    db: Session = Depends(get_db)
):
    # API should only accept application/json reqeuets
    if not prompt.username or not prompt.prompt:
        raise HTTPException(status_code=400, detail="All fields are required.")

    # Authenticate user
    user = db.query(User).filter(User.username == prompt.username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid user")

    try:
        timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S%f")
        image_name = f'{prompt.username}-{timestamp}'
        # Save the generated image information
        image_bytes = query({"inputs": prompt.prompt})
        saved_image_path = process_and_save_image(image_bytes, image_name)
        new_generated_image = GeneratedImage(
            id=image_name,
            user_username=prompt.username,
            prompt=prompt.prompt,
            url=saved_image_path
        )
        db.add(new_generated_image)
        db.commit()
        return db.query(GeneratedImage).get(image_name)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f'Error Generating Image {str(e)}')

@app.get("/user-generated-images/{username}")
async def get_user_generated_images_paths(username: str, db: Session = Depends(get_db)):
    # Retrieve all generated images for the specified username
    user_generated_images = db.query(GeneratedImage).filter(
        GeneratedImage.user_username == username).all()
    if not user_generated_images:
        raise HTTPException(
            status_code=404, detail=f"No generated images found for user: {username}")

    return user_generated_images

@app.get("/gallery-images", response_model=List[dict])
async def get_gallery_images():
    generated_images = []

    for image_name in os.listdir(images_directory):
        image_url = f"/api/images/{image_name}"
        generated_images.append({"url": image_url})

    return generated_images