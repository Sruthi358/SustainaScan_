# import pytesseract
# import cv2
# import numpy as np
# from PIL import Image
# import io

# def preprocess_image(image):
#     """Preprocess image for better OCR results"""
#     # Convert to numpy array if it's a PIL Image
#     if isinstance(image, Image.Image):
#         img = np.array(image)
#     else:
#         img = image
    
#     # Convert to grayscale
#     img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
#     # Apply thresholding
#     img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    
#     # Apply dilation and erosion to remove noise
#     kernel = np.ones((1, 1), np.uint8)
#     img = cv2.dilate(img, kernel, iterations=1)
#     img = cv2.erode(img, kernel, iterations=1)
    
#     return img

# def extract_text_from_image(image_file):
#     """Extract text from uploaded image file"""
#     try:
#         # Open the image file
#         image = Image.open(io.BytesIO(image_file.read()))
        
#         # Preprocess the image
#         processed_img = preprocess_image(image)
        
#         # Perform OCR
#         text = pytesseract.image_to_string(processed_img)
        
#         return text
#     except Exception as e:
#         raise Exception(f"OCR processing failed: {str(e)}")




# import pytesseract
# import cv2
# import numpy as np
# from PIL import Image
# import io



# def preprocess_image(image):
#     """Enhanced image preprocessing for ingredient lists"""
#     if isinstance(image, Image.Image):
#         img = np.array(image)
#     else:
#         img = image
    
#     # Convert to grayscale
#     img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


    

#     # newly added
#         # Add these steps before thresholding:
#     img = cv2.GaussianBlur(img, (3,3), 0)
#     img = cv2.fastNlMeansDenoising(img, None, 10, 7, 21)
#     # Increase contrast
#     img = cv2.convertScaleAbs(img, alpha=1.5, beta=40)



    
#     # Apply adaptive thresholding
#     img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
#                               cv2.THRESH_BINARY, 11, 2)
    
#     # Apply slight blur to reduce noise
#     img = cv2.medianBlur(img, 3)
    
#     # Apply dilation and erosion
#     kernel = np.ones((1, 1), np.uint8)
#     img = cv2.dilate(img, kernel, iterations=1)
#     img = cv2.erode(img, kernel, iterations=1)
    
#     # Scale up if image is too small
#     height, width = img.shape
#     if height < 500 or width < 500:
#         img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    
#     return img

# def extract_text_from_image(image_file):
#     """Extract text from uploaded image file with improved OCR settings"""
#     try:
#         # Open the image file
#         image = Image.open(io.BytesIO(image_file.read()))
        
#         # Preprocess the image
#         processed_img = preprocess_image(image)
        
#         # Perform OCR with custom configuration
#         custom_config = r'--oem 3 --psm 6 -l eng'
#         text = pytesseract.image_to_string(processed_img, config=custom_config)
        
#         return text
#     except Exception as e:
#         raise Exception(f"OCR processing failed: {str(e)}")




import easyocr
import cv2
import numpy as np
from PIL import Image
import io
# import re

# Initialize reader once (Django's app-ready)
reader = easyocr.Reader(['en'], gpu=True)  # English only for better performance

def extract_ingredients_text(image_file):
    """Optimized version of your working code for Django"""
    try:
        # Read image file
        image = Image.open(io.BytesIO(image_file.read()))
        img_array = np.array(image)
        
        # Convert to RGB if needed
        if len(img_array.shape) == 2:  # Grayscale
            img_rgb = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
        else:
            img_rgb = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
        
        # Extract all text
        results = reader.readtext(img_rgb, paragraph=False)
        full_text = ' '.join([res[1] for res in results]).lower()
        
        # Find ingredients section (more robust detection)
        ingredients_section = ""
        for sep in ["ingredients", "contains", "composition"]:
            idx = full_text.find(sep)
            if idx != -1:
                ingredients_section = full_text[idx + len(sep):].strip()
                # Remove everything after next section if found
                for end_sep in ["directions", "how to use", "warning"]:
                    end_idx = ingredients_section.find(end_sep)
                    if end_idx != -1:
                        ingredients_section = ingredients_section[:end_idx]
                break
        
        return ingredients_section if ingredients_section else full_text
    
    except Exception as e:
        raise Exception(f"EasyOCR extraction failed: {str(e)}")