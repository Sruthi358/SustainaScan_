import re

def normalize_product_name(title):
    if not title:
        return ""

    title = title.lower()
    title = re.sub(r"\d+.*", "", title)     # remove weights/sizes
    title = re.sub(r"[^a-z\s]", "", title)  # remove symbols

    keywords = [
        "lip balm", "shampoo", "soap", "toothpaste",
        "conditioner", "face wash", "body lotion", "sunscreen"
    ]

    for k in keywords:
        if k in title:
            return k

    return title.strip()
