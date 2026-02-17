from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Ingredient, Product, Review, Cart, Product, Order, OrderItem

from .models import BarcodeProduct


@admin.register(BarcodeProduct)
class BarcodeProductAdmin(admin.ModelAdmin):
    list_display = (
        "barcode",
        "title",
        "brand",
        "category",
        "carbon_footprint",
    )
    search_fields = ("barcode", "title", "brand", "category")
    list_filter = ("category", "brand")


class CustomUserAdmin(UserAdmin):
    # Fields to display in the user list
    list_display = ('username', 'email', 'full_name', 'mobile_number', 'city_state')
    # Fields to show when editing a user
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'email', 'mobile_number', 'city_state')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    # Fields to show when ADDING a new user (simplified)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'full_name', 'mobile_number', 'city_state', 'password1', 'password2'),
        }),
    )

admin.site.register(User, CustomUserAdmin)

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'added_at')
    list_filter = ('user', 'added_at')
    search_fields = ('user__username', 'product__product_name')
    raw_id_fields = ('user', 'product')  # For better performance with many records

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'product_name', 
        'brand_name',
        'category',
        'price',
        'in_stock',
        'carbon_footprint',
        'date_added'
    )
    list_filter = (
        'category',
        'brand_name',
        'chemical_free',
        'in_stock',
        'date_added'
    )
    search_fields = (
        'product_name',
        'brand_name',
        'category',
        'product_description'
    )
    raw_id_fields = ('ingredients',)
    date_hierarchy = 'date_added'
    list_per_page = 25
    list_editable = ('price', 'in_stock')
    ordering = ('-date_added',)
    def formatted_date(self, obj):
        return obj.date_added.strftime("%b %d, %Y, %I:%M %p")
    formatted_date.short_description = 'ADDED AT'
    formatted_date.admin_order_field = 'date_added'
    actions = ['mark_as_in_stock']
    def mark_as_in_stock(self, request, queryset):
        queryset.update(in_stock=True)
    mark_as_in_stock.short_description = "Mark selected products as in stock"
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['total_products'] = Product.objects.count()
        return super().changelist_view(request, extra_context=extra_context)

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('ingredient_name', 'carbon_emission_factor', 'default_proportion')
    search_fields = ('ingredient_name',)
    raw_id_fields = ()  # Add any FK fields here if needed later

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        'product',
        'user',
        'rating_stars',
        'short_comment',
        'created_at',
        'is_recent'
    )
    list_filter = (
        'rating',
        'created_at',
        'product__category'
    )
    search_fields = (
        'user__username',
        'product__product_name',
        'comment'
    )
    raw_id_fields = ('user', 'product')  # Better for performance with many records
    date_hierarchy = 'created_at'
    list_per_page = 25
    ordering = ('-created_at',)
    list_select_related = ('user', 'product')  # Optimizes database queries
    
    # Custom methods for display
    def rating_stars(self, obj):
        return '★' * obj.rating + '☆' * (5 - obj.rating)
    rating_stars.short_description = 'Rating'
    
    def short_comment(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    short_comment.short_description = 'Comment Preview'
    
    def is_recent(self, obj):
        from django.utils.timezone import now
        from datetime import timedelta
        return obj.created_at >= now() - timedelta(days=7)
    is_recent.boolean = True
    is_recent.short_description = 'Recent?'
    
    # Custom actions
    actions = ['approve_reviews', 'reset_ratings']
    
    def approve_reviews(self, request, queryset):
        # This is a placeholder - add your approval logic if needed
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} reviews approved.")
    approve_reviews.short_description = "Approve selected reviews"
    
    def reset_ratings(self, request, queryset):
        updated = queryset.update(rating=3)
        self.message_user(request, f"{updated} reviews reset to 3 stars.")
    reset_ratings.short_description = "Reset ratings to 3 stars"
    
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1  # Show one empty form by default
    fields = ('product', 'product_name', 'quantity', 'price')
    readonly_fields = ('product_name', 'price')  # These will be auto-filled

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'id')
    inlines = [OrderItemInline]
    readonly_fields = ('created_at',)
    
    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            if isinstance(instance, OrderItem):
                # Auto-fill product_name and price if not set
                if not instance.product_name:
                    instance.product_name = instance.product.product_name
                if not instance.price:
                    instance.price = instance.product.price
                instance.save()
        formset.save_m2m()