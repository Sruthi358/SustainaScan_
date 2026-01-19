import requests
import os

BARCODELOOKUP_API_KEY = os.getenv("BARCODELOOKUP_API_KEY")

def fetch_product_from_barcode(barcode):
    url = "https://api.barcodelookup.com/v3/products"
    params = {
        "barcode": barcode,
        "key": BARCODELOOKUP_API_KEY
    }

    response = requests.get(url, params=params, timeout=10)

    if response.status_code != 200:
        return None

    data = response.json()
    products = data.get("products")

    if not products:
        return None

    p = products[0]

    return {
        "barcode": barcode,
        "title": p.get("title"),
        "brand": p.get("brand"),
        "category": p.get("category"),
        "manufacturer": p.get("manufacturer"),
        "size": p.get("size"),
        "weight": p.get("weight"),
        "description": p.get("description"),
        "image_url": p.get("images", [None])[0]
    }
