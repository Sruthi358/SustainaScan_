from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Cart, Review, Product, Order, OrderItem
from rest_framework import serializers

User = get_user_model() 

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'full_name', 'mobile_number', 'city_state', 'password', 'confirmPassword']
    
    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirmPassword')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            mobile_number=validated_data['mobile_number'],
            city_state=validated_data['city_state']
        )
        return user
    
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'  # or list fields explicitly including 'price' and 'ecoscore'

class CartSerializer(serializers.ModelSerializer):
    # product = ProductSerializer()  # <-- This includes product details
    product = ProductSerializer(read_only=True) 
    class Meta:
        model = Cart
        fields = ['id', 'product', 'quantity', 'added_at']
        read_only_fields = ['id', 'added_at']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    # username = serializers.CharField(source='user.username', read_only=True)
    username = serializers.SerializerMethodField()  # Use SerializerMethodField for custom handling
    product = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'product', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'username', 'product']
    def get_username(self, obj):
        # This ensures we always get the username if the user exists
        return obj.user.username if obj.user else "Anonymous"

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'amount',
            'status',
            'created_at',
            'items'
        ]