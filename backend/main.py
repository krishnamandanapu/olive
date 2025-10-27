from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.dogs import router
from services.dog_service import load_all_dogs_background
from routes.dogs import CACHE
from utils.logger import setup_logging, get_logger
import asyncio

# Initialize logging first
setup_logging()
logger = get_logger(__name__)

app = FastAPI(title="Dog API", description="A API for dog breeds and images")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    logger.debug("Health check endpoint called")
    return {"status": "ok"}

app.include_router(router, prefix="/api", tags=["Dogs"])

# Start background loading on startup - doesn't block!
@app.on_event("startup")
async def start_background_loading():
    logger.info("Application startup - Starting background dog loading task")
    # Create background task that loads data incrementally
    asyncio.create_task(load_all_dogs_background(CACHE))
    logger.info("Background task started! API is ready to serve requests")
