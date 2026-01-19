from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

class User(AbstractUser):
    # Custom fields
    full_name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15)
    city_state = models.CharField(max_length=100)
    
    # Remove unwanted default fields
    first_name = None
    last_name = None
    
    # Explicit username declaration (optional but good for customization)
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        error_messages={
            "unique": "A user with that username already exists.",
        },
    )
    
    def __str__(self):
        return self.username 

class Ingredient(models.Model):
    ingredient_name = models.CharField(max_length=100, unique=True)
    carbon_emission_factor = models.FloatField()  # g CO₂e per gram
    default_proportion = models.FloatField()      # Percentage (0-100)
    toxicity = models.FloatField()                # 0-10 scale
    biodegradability = models.FloatField()        # 0-100 scale

    def __str__(self):
        return self.ingredient_name

class Product(models.Model):
    product_name = models.CharField(max_length=255)
    product_type = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    brand_name = models.CharField(max_length=100)
    product_link = models.URLField(max_length=1000)
    volume = models.CharField(max_length=50)
    chemical_free = models.BooleanField()
    packaging_type = models.CharField(max_length=100)
    price = models.FloatField()
    in_stock = models.BooleanField()
    return_period = models.CharField(max_length=50)
    expiry_date = models.DateField()
    product_description = models.TextField(max_length=5000)
    product_image = models.ImageField(upload_to='images/', null=True, blank=True)
    ingredients_raw = models.TextField(max_length=5000, blank=True, null=True)
    ingredients = models.ManyToManyField(Ingredient)
    ecoscore = models.FloatField()      # Final score (0-100)
    carbon_footprint = models.FloatField()       # Total CF score
    toxicity_score = models.FloatField()        # T (0-100)
    biodegradability_score = models.FloatField()        # B (0-100)
    date_added = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_name

User = get_user_model()

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.product.product_name}"
    
    class Meta:
        ordering = ['-created_at'] 

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # Prevent duplicate items in cart

    def __str__(self):
        return f"{self.quantity} x {self.product.product_name} in {self.user.username}'s cart"

from django.db import models
from django.contrib.auth import get_user_model
from accounts.models import Product

User = get_user_model()

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    amount = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username} - ₹{self.amount}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.FloatField()

    def __str__(self):
        return f"{self.quantity} x {self.product_name} (Order #{self.order.id})"
    
    def save(self, *args, **kwargs):
        # Store product name at time of order creation
        if not self.product_name:
            self.product_name = self.product.product_name
        super().save(*args, **kwargs)



class Products(models.Model):
    name = models.CharField(max_length=255)
    ingredients = models.TextField()

    class Meta:
        db_table = "accounts_products"  # IMPORTANT

    def __str__(self):
        return self.name





# major

class Products(models.Model):
    """
    Base product-ingredient reference table
    Used to map product names to ingredient lists
    """

    name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Generic product name (e.g. lip balm, shampoo)"
    )

    ingredients = models.TextField(
        help_text="Complete ingredient list"
    )

    def __str__(self):
        return self.name



class BarcodeProduct(models.Model):
    """
    Stores full details of barcode-scanned products
    to avoid repeated API calls and recomputation
    """

    # 🔹 Barcode identifier
    barcode = models.CharField(
        max_length=20,
        unique=True,
        help_text="EAN / UPC barcode number"
    )

    # 🔹 API metadata
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255, blank=True, null=True)
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)

    size = models.CharField(max_length=50, blank=True, null=True)
    weight = models.CharField(max_length=50, blank=True, null=True)

    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)

    # 🔹 Ingredients (resolved from Products table / OCR)
    ingredients = models.TextField()

    # 🔹 Environmental scores (calculated once)
    ecoscore = models.FloatField()
    carbon_footprint = models.FloatField()
    toxicity = models.FloatField()
    biodegradability = models.FloatField()

    # 🔹 Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.barcode})"
