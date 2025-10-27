from models.dog_model import Dog

def clean_dog_data(raw_list):
    """Validate and clean the 3rd party response."""
    cleaned = []
    for item in raw_list:
        try:
            dog = Dog(**item)
            cleaned.append(dog.dict())
        except Exception:
            continue
    return cleaned
