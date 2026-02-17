# def calculate_ecoscore_from_ingredients(ingredients_text):
#     """
#     Dummy calculation for now.
#     You can plug in your existing ecoscore logic here.
#     """

#     carbon_footprint = 30
#     toxicity = 20
#     biodegradability = 70

#     ecoscore = (
#         0.4 * (100 - carbon_footprint)
#         + 0.3 * (100 - toxicity)
#         + 0.3 * biodegradability
#     )

#     return {
#         "ecoscore": round(ecoscore, 1),
#         "carbon_footprint": carbon_footprint,
#         "toxicity": toxicity,
#         "biodegradability": biodegradability
#     }


from accounts.models import Ingredient

def calculate_ecoscore_from_ingredients(ingredients_text):
    """
    Calculate ecoscore using real ingredient-based logic.
    ingredients_text is expected to be a string (comma-separated or OCR text).
    """

    # Normalize text
    text = ingredients_text.lower()

    # Fetch all ingredients from DB
    db_ingredients = Ingredient.objects.all()

    # Find matching ingredients by name presence
    used_ingredients = []
    for ing in db_ingredients:
        if ing.ingredient_name.lower() in text:
            used_ingredients.append(ing)

    if not used_ingredients:
        return {
            "ecoscore": 0,
            "carbon_footprint": 0,
            "toxicity": 0,
            "biodegradability": 0
        }

    # 🔹 Real calculation logic (same as calculate_ecoscore)
    total_cf = sum(
        (ing.default_proportion / 100.0) * ing.carbon_emission_factor
        for ing in used_ingredients
    )

    total_toxicity = sum(
        (ing.default_proportion / 100.0) * ing.toxicity
        for ing in used_ingredients
    )

    total_biodegradability = sum(
        (ing.default_proportion / 100.0) * ing.biodegradability
        for ing in used_ingredients
    )

    # Convert to scores
    cf_score = 100 - (total_cf / 10 * 100)
    cf_score = max(0, min(100, cf_score))

    toxicity_score = max(0, 100 - (total_toxicity * 10))
    bio_score = min(100, total_biodegradability)

    #latest
    total_cf = round(total_cf, 3)
    # ecoscore = (0.4 * cf_score) + (0.3 * toxicity_score) + (0.3 * bio_score) - 20
    # ecoscore = round(total_cf, 3)
    # ecoscore = max(0, min(100, round(ecoscore, 1)))

    return {
        "ecoscore": total_cf,
        "carbon_footprint": total_cf,
        "toxicity": round(toxicity_score, 1),
        "biodegradability": round(bio_score, 1)
    }

