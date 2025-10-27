from fastapi import APIRouter, Query
from math import ceil
from services.dog_service import get_available_dogs, has_data_for_range, is_loading_complete
from utils.logger import get_logger
from config import ITEMS_PER_PAGE

router = APIRouter()
logger = get_logger(__name__)

# simple in-memory cache
CACHE = {
    "dogs": [],
    "loading": False,
    "loaded_count": 0,
    "last_updated": None
}

@router.get("/dogs")
async def get_dogs(page: int = Query(1, ge=1)):
    logger.debug(f"API request for page {page}")

    # Get whatever data is available right now (don't wait!)
    dogs = get_available_dogs(CACHE)

    start = (page - 1) * ITEMS_PER_PAGE
    end = start + ITEMS_PER_PAGE

    # Check if we have data for this page (just need data from start onwards)
    if not has_data_for_range(CACHE, start):
        # Data not available yet
        if is_loading_complete(CACHE):
            # Loading is done, but page is out of range
            total_items = len(dogs)
            total_pages = ceil(total_items / ITEMS_PER_PAGE) if total_items else 1
            logger.warning(f"Page {page} out of range. Total pages: {total_pages}, Total items: {total_items}")
            return {
                "error": "Page out of range",
                "page": page,
                "total_pages": total_pages
            }
        else:
            # Still loading, data for this page not ready yet
            logger.info(f"Page {page} requested but not loaded yet. Currently have {len(dogs)} items")
            return {
                "error": "Data for this page is not loaded yet. Please try again in a moment.",
                "page": page,
                "loading": True,
                "loaded_items": len(dogs)
            }

    # We have data! Return it immediately
    total_items = len(dogs)
    total_pages = ceil(total_items / ITEMS_PER_PAGE) if total_items else 1

    logger.info(f"Successfully serving page {page} with {len(dogs[start:end])} items")

    return {
        "page": page,
        "total_pages": total_pages,
        "items_per_page": ITEMS_PER_PAGE,
        "total_items": total_items,
        "items": dogs[start:end],
        "loading_complete": is_loading_complete(CACHE)
    }
