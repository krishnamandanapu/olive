import httpx
import asyncio
from utils.validators import clean_dog_data
from utils.logger import get_logger
from config import DOG_API_URL

logger = get_logger(__name__)

TRANSIENT_STATUSES = {400, 403, 429, 500, 502, 503, 504}

async def fetch_page(page: int, retries: int = 5):
    url = f"{DOG_API_URL}?page={page}"

    for attempt in range(1, retries + 1):
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url)

                if res.status_code == 200:
                    data = res.json()
                    if isinstance(data, list): # could be a list of dogs or empty list
                        logger.debug(f"Page {page}: Successfully fetched {len(data)} items")
                        return data
                    else:
                        logger.warning(f"Page {page}: unexpected JSON (not a list)")
                        return None

                if res.status_code in TRANSIENT_STATUSES:
                    logger.warning(f"Page {page}: transient {res.status_code}, attempt {attempt}/{retries}")
                    await asyncio.sleep(0.5 * attempt)
                    continue

                logger.error(f"Page {page}: non-retryable status {res.status_code}")
                return None

        except Exception as e:
            logger.error(f"Page {page}: exception on attempt {attempt}: {e}", exc_info=True)
            await asyncio.sleep(0.5 * attempt)
            continue

    logger.error(f"Page {page}: failed after {retries} attempts")
    return None


async def load_all_dogs_background(cache: dict):
    """
    Background task that loads all dogs incrementally.
    Updates cache as data arrives so early pages can be served immediately.
    """
    logger.info("Starting background dog loading from external API")
    cache["loading"] = True

    all_dogs = []
    page = 1

    while True:
        data = await fetch_page(page)

        if data is None:
            # failure: skip this page, try next
            logger.warning(f"Skipping failed page {page}, continuing to next page")
            page += 1
            continue

        if len(data) == 0:
            # success with empty list: end-of-data
            logger.info(f"End of data reached at page {page}")
            break

        cleaned = clean_dog_data(data)
        all_dogs.extend(cleaned)

        # Update cache incrementally - this allows early pages to be served
        cache["dogs"] = all_dogs.copy()
        logger.info(f"Loaded page {page}, total dogs in cache: {len(all_dogs)}")

        page += 1
        await asyncio.sleep(0.2)  # gentle throttle

    # Mark as complete
    cache["dogs"] = all_dogs
    cache["loading"] = False
    cache["loaded_count"] = len(all_dogs)
    logger.info(f"Background loading complete! Total dogs loaded: {len(all_dogs)}")


def get_available_dogs(cache: dict):
    """
    Returns the currently available dogs from cache.
    Does NOT wait for all data to load.
    """
    return cache.get("dogs", [])


def is_loading_complete(cache: dict) -> bool:
    """Check if background loading is complete."""
    return not cache.get("loading", False)


def has_data_for_range(cache: dict, start: int) -> bool:
    """
    Check if we have data available to start serving the requested page.
    We only need data from the start index onwards.
    """
    dogs = cache.get("dogs", [])
    return len(dogs) > start
