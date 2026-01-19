import re
from difflib import get_close_matches

def find_ingredient_matches(text, db_ingredients):
    """
    Match extracted text against database ingredients
    Args:
        text: Extracted text from OCR
        db_ingredients: Django QuerySet of Ingredient objects
    Returns: {
        'exact_matches': [ingredient_objects],
        'partial_matches': [{'text': str, 'suggestions': [str]}],
        'unmatched': [str]
    }
    """
    # Get all ingredient names from DB (lowercase)
    # all_ingredients = [ing.lower() for ing in db_ingredients]
    # new
     # Get all ingredient names from DB (lowercase)
    all_ingredient_names = list(db_ingredients.values_list('ingredient_name', flat=True))
    all_ingredients_lower = [name.lower() for name in all_ingredient_names]
    
    # Clean and tokenize text
    words = re.findall(r'\b[\w-]+\b', text.lower())
    words = [w for w in words if len(w) > 2]  # Skip short words
    
    # Find matches
    exact_matches = set()
    partial_matches = []
    unmatched = []
    
    for word in words:
        # Exact match
        if word in all_ingredients_lower:
            # exact_matches.add(word)
            # continue
            # new
            # Get the properly capitalized version
            idx = all_ingredients_lower.index(word)
            exact_matches.add(all_ingredient_names[idx])
            continue
            
        # Fuzzy match
        closest = get_close_matches(word, all_ingredients_lower, n=1, cutoff=0.7)
        if closest:
            idx = all_ingredients_lower.index(closest[0])
            partial_matches.append({
                'text': word,
                'suggestions': [all_ingredient_names[idx]]
            })
        else:
            unmatched.append(word)
    

    print(list(exact_matches))
    print(partial_matches)
    print(unmatched)
    
    # Get full objects for exact matches
    # matched_objects = list(db_ingredients.filter(
    #     ingredient_name__in=[m.title() for m in exact_matches]
    # ))
    
    return {
        'exact_matches': list(exact_matches),
        'partial_matches': partial_matches,
        'unmatched': unmatched
    }