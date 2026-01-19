# from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .utils.ocr import extract_ingredients_text
from .utils.ingredients import find_ingredient_matches
from accounts.models import Ingredient, Product, Products, BarcodeProduct
from .utils.barcode import extract_barcode_from_image
from .utils.barcodelookup import fetch_product_from_barcode
from .utils.product_match import normalize_product_name
from .utils.ecoscore_calc import calculate_ecoscore_from_ingredients
from django.http import QueryDict
import json

GENERIC_PRODUCT_NAMES = [
    "moisturizer",
    "face cream",
    "cream",
    "lotion",
    "shampoo",
    "soap",
    "lip balm",
    "toothpaste",
    "deodorant",
    "body wash",
    "face wash"
]

def extract_generic_name(title):
    title = title.lower()
    for name in GENERIC_PRODUCT_NAMES:
        if name in title:
            return name
    return None

def get_barcode_alternative_products(request):
    product_title = request.GET.get("product_title", "").lower()

    if not product_title:
        return JsonResponse({"products": []})

    try:
        # 1️⃣ Match barcode title with accounts_products
        base_product = None
        for p in Products.objects.all():
            if p.name.lower() in product_title:
                base_product = p
                break

        if not base_product:
            print("❌ No base product matched")
            return JsonResponse({"products": []})

        print("BASE PRODUCT:", base_product.name)

        # 2️⃣ Fetch alternatives using CATEGORY field ONLY ✅
        alternatives = Product.objects.filter(
            category__icontains=base_product.name,
            ecoscore__isnull=False
        ).order_by("-ecoscore")[:5]

        print("ALT COUNT:", alternatives.count())

        products_data = [{
            "id": p.id,
            "product_name": p.product_name,
            "price": p.price,
            "ecoscore": p.ecoscore,
            "product_description": p.product_description,
            "product_image": p.product_image.url if p.product_image else None
        } for p in alternatives]


        return JsonResponse({"products": products_data})

    except Exception as e:
        return JsonResponse({"products": [], "error": str(e)})

@csrf_exempt
@require_POST
def scan_barcode(request):
    try:
        # 1️⃣ Get barcode
        barcode = request.POST.get("barcode")

        if not barcode and "barcode_image" in request.FILES:
            barcode = extract_barcode_from_image(request.FILES["barcode_image"])

        if not barcode:
            return JsonResponse({
                "success": False,
                "message": "Barcode not detected"
            })

        # 2️⃣ Check cache
        cached = BarcodeProduct.objects.filter(barcode=barcode).first()
        if cached:
            # Fetch alternatives
            # alt_request = request
            # alt_request.GET = QueryDict(mutable=True)
            # alt_request.GET["category"] = cached.category

            # alternatives_response = get_alternative_products(alt_request)
            # alternatives_data = json.loads(
            #     alternatives_response.content.decode("utf-8")
            # )
            alt_request = request
            alt_request.GET = QueryDict(mutable=True)
            alt_request.GET["product_title"] = cached.title

            alternatives_response = get_barcode_alternative_products(alt_request)
            alternatives_data = json.loads(
                alternatives_response.content.decode("utf-8")
            )


            return JsonResponse({
                "success": True,
                "cached": True,
                "product": {
                    "title": cached.title,
                    "brand": cached.brand,
                    "category": cached.category,
                    "image_url": cached.image_url,
                    "ingredients": cached.ingredients,
                    "ecoscore": cached.ecoscore,
                    "carbon_footprint": cached.carbon_footprint,
                    "toxicity": cached.toxicity,
                    "biodegradability": cached.biodegradability
                },
                "alternatives": alternatives_data.get("products", [])
            })

        # 3️⃣ Fetch product from barcode API
        api_product = fetch_product_from_barcode(barcode)
        if not api_product:
            return JsonResponse({
                "success": False,
                "message": "Product not found"
            })

        # 4️⃣ Get ingredients base product (CORRECT)
        normalized = normalize_product_name(api_product["title"])

        base_product = Products.objects.filter(
            name__icontains=normalized
        ).first()

        # fallback only if nothing matches
        if not base_product:
            base_product = Products.objects.first()


        if not base_product:
            return JsonResponse({
                "success": False,
                "message": "Ingredients not available yet"
            })

        # 5️⃣ Calculate ecoscore using REAL logic
        scores = calculate_ecoscore_from_ingredients(
            base_product.ingredients
        )

        # 6️⃣ Save to barcode cache
        saved = BarcodeProduct.objects.create(
            barcode=barcode,
            title=api_product["title"],
            brand=api_product["brand"],
            category=api_product["category"],
            manufacturer=api_product.get("manufacturer"),
            size=api_product.get("size"),
            weight=api_product.get("weight"),
            description=api_product.get("description"),
            image_url=api_product.get("image_url"),
            ingredients=base_product.ingredients,
            ecoscore=scores["ecoscore"],
            carbon_footprint=scores["carbon_footprint"],
            toxicity=scores["toxicity"],
            biodegradability=scores["biodegradability"]
        )

        # 7️⃣ Fetch alternatives
        alt_request = request
        alt_request.GET = QueryDict(mutable=True)
        alt_request.GET["product_title"] = saved.title

        alternatives_response = get_barcode_alternative_products(alt_request)
        alternatives_data = json.loads(
            alternatives_response.content.decode("utf-8")
        )


        # 8️⃣ Final response
        return JsonResponse({
            "success": True,
            "cached": False,
            "product": {
                "title": saved.title,
                "brand": saved.brand,
                "category": saved.category,
                "image_url": saved.image_url,
                "ingredients": saved.ingredients,
                "ecoscore": saved.ecoscore,
                "carbon_footprint": saved.carbon_footprint,
                "toxicity": saved.toxicity,
                "biodegradability": saved.biodegradability
            },
            "alternatives": alternatives_data.get("products", [])
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        })

def get_alternative_products(request):
    category = request.GET.get('category', '').strip().lower()
    if not category:
        return JsonResponse({'products': []}, status=400)
    
    try:
        # Get top 5 products in the same category with highest ecoscore
        # Using case-insensitive contains for more flexible matching
        alternatives = Product.objects.filter(
            category__icontains=category
        ).order_by('-ecoscore')[:5]
        
        # Ensure we're returning products with all required fields
        products_data = []
        for p in alternatives:
            product_data = {
                'id': p.id,
                'product_name': p.name,  # Changed to match frontend expectation
                'ecoscore': p.ecoscore,
                'product_description': p.description,  # Changed to match frontend
                'image_url': p.image.url if p.image else None
            }
            products_data.append(product_data)
        
        return JsonResponse({
            'products': products_data
        })
        
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'products': []
        }, status=500)

@csrf_exempt
@require_POST
def calculate_ecoscore(request):
    try:
        # Get inputs
        image_file = request.FILES['image']
        product_name = request.POST.get('name', '')
        
        # Step 1: Extract text
        ingredients_text = extract_ingredients_text(image_file)
        
        # Step 2: Get all ingredients
        db_ingredients = Ingredient.objects.all()
        
        # Step 3: Find matches
        matches = find_ingredient_matches(ingredients_text, db_ingredients)
        
        # Step 4: Get ALL ingredients to use in calculation (exact + partial suggestions)
        all_used_ingredients = []
        
        # Add exact matches
        exact_matches = list(db_ingredients.filter(
            ingredient_name__in=matches['exact_matches']
        ))
        all_used_ingredients.extend(exact_matches)
        
        # Add partial matches (using their first suggestion)
        for partial in matches['partial_matches']:
            suggested_ing = db_ingredients.filter(
                ingredient_name=partial['suggestions'][0]
            ).first()
            if suggested_ing:
                all_used_ingredients.append(suggested_ing)
        
        # Step 5: Calculate EcoScore using ALL ingredients
        if all_used_ingredients:
            # Calculate total proportion (sum should be <= 100)
            # total_proportion = sum(ing.default_proportion for ing in all_used_ingredients)
            # proportion_factor = min(100, total_proportion) / 100.0
            # Calculate weighted impacts
            total_cf = sum(
                (ing.default_proportion / 100.0) * ing.carbon_emission_factor
                for ing in all_used_ingredients
            )
            
            total_toxicity = sum(
                (ing.default_proportion / 100.0) * ing.toxicity
                for ing in all_used_ingredients
            )
            
            total_biodegradability = sum(
                (ing.default_proportion / 100.0) * ing.biodegradability
                for ing in all_used_ingredients
            ) 
            
            # Convert to scores (0-100)
            # cf_score = max(0, 100 - (total_cf * 10))  # Lower carbon is better
            cf_score = 100 - (total_cf / 10 * 100)
            cf_score = max(0, min(100, cf_score))
            toxicity_score = max(0, 100 - (total_toxicity * 10))  # Lower toxicity is better
            bio_score = min(100, total_biodegradability)  # Higher is better
            
            # Calculate composite EcoScore
            ecoscore = (0.4 * cf_score) + (0.3 * toxicity_score) + (0.3 * bio_score) - 20
            ecoscore = max(0, min(100, round(ecoscore, 1)))
        else:
            ecoscore = 0
            cf_score = 0
            toxicity_score = 0
            bio_score = 0
        
        # Prepare response
        response = {
            'success': True,
            'ecoscore': ecoscore,
            'bio_score':bio_score,
            'cf_score':cf_score,
            'toxicity_score':toxicity_score,
            'product_name': product_name,
            'ingredients': {
                'exact_matches': [{
                    'name': ing.ingredient_name,
                    'cf': ing.carbon_emission_factor,
                    'toxicity': ing.toxicity,
                    'biodegradability': ing.biodegradability,
                    'proportion': ing.default_proportion,
                    'match_type': 'exact'
                } for ing in exact_matches],
                'partial_matches': [{
                    'original_text': partial['text'],
                    'matched_ingredient': {
                        'name': partial['suggestions'][0],
                        'cf': db_ingredients.get(ingredient_name=partial['suggestions'][0]).carbon_emission_factor,
                        'toxicity': db_ingredients.get(ingredient_name=partial['suggestions'][0]).toxicity,
                        'biodegradability': db_ingredients.get(ingredient_name=partial['suggestions'][0]).biodegradability,
                        'proportion': db_ingredients.get(ingredient_name=partial['suggestions'][0]).default_proportion,
                    },
                    'match_type': 'partial'
                } for partial in matches['partial_matches']],
                'unmatched': matches['unmatched']
            },
            'breakdown': {
                'carbon_footprint': cf_score,
                'toxicity': toxicity_score,
                'biodegradability': bio_score,
                'total_ingredients': len(matches['exact_matches']) + len(matches['partial_matches']) + len(matches['unmatched']),
                'recognized_ingredients': len(all_used_ingredients)
            }
        }      
        return JsonResponse(response)      
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})