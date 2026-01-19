from pyzbar.pyzbar import decode
from PIL import Image

def extract_barcode_from_image(image_file):
    image = Image.open(image_file)
    decoded = decode(image)

    if not decoded:
        return None

    return decoded[0].data.decode("utf-8")
