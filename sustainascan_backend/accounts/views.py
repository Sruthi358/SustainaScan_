from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer
# for login
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
# for eco score calculation latest added after below commented code
from rest_framework.parsers import MultiPartParser, FormParser  # For file uploads
from .models import Product, Ingredient
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Cart
from .serializers import CartSerializer
from rest_framework import generics, permissions
from .serializers import OrderSerializer
from .models import Order, OrderItem
from .serializers import ProductSerializer
from django.http import Http404
# review
from rest_framework import viewsets
from .models import Review
from .serializers import ReviewSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        return Review.objects.filter(
            product_id=self.kwargs['product_id']
        ).select_related('user')  # This ensures user data is fetched efficiently

    def perform_create(self, serializer):
        serializer.save(
            product_id=self.kwargs['product_id'],
            user=self.request.user
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['product_id'] = self.kwargs['product_id']
        return context

class UserRegistrationView(APIView):
    def post(self, request):
        print("Received data:", request.data)  # Debug incoming data
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Capture the returned user object
            print("User created:", user.username)
            return Response({
                "status": "success",
                "message": "User created successfully",
                "user_id": user.id,
                "username": user.username
            }, status=status.HTTP_201_CREATED)
        print("Validation errors:", serializer.errors)
        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_admin': user.is_staff  # 👈 Django's built-in admin flag
                }
            }, status=status.HTTP_200_OK)
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )      

# Define maximum CF values per category
MAX_CF_PER_CATEGORY = {
    "Shampoo": 10.0,
    "Conditioner": 8.0,
    # Add other categories...
}

@method_decorator(csrf_exempt, name='dispatch')
class AddProductView(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Required for file uploads

    def post(self, request):
        try:
            # Extract ingredients
            ingredients_str = request.data.get('ingredients', '')
            ingredient_names = [name.strip() for name in ingredients_str.split(',')]

            # Fetch valid ingredients
            valid_ingredients = Ingredient.objects.filter(
                ingredient_name__in=ingredient_names
            )

            total_cf = sum(
                (ing.default_proportion / 100.0) * ing.carbon_emission_factor
                for ing in valid_ingredients
            )

            total_toxicity = sum(
                (ing.default_proportion / 100.0) * ing.toxicity
                for ing in valid_ingredients
            )

            total_biodegradability = sum(
                (ing.default_proportion / 100.0) * ing.biodegradability
                for ing in valid_ingredients
            )

            # Calculate individual scores
            T = max(0, 100 - (total_toxicity * 10))  # Toxicity (0-100)
            B = min(100, total_biodegradability)      # Biodegradability (0-100)
            cf_score = 100 - (total_cf / MAX_CF_PER_CATEGORY.get(request.data.get('category'), 10.0) * 100)
            cf_score = max(0, min(100, cf_score))     # Clamp to 0-100

            # Final Eco-Score
            ecoscore = (0.4 * cf_score) + (0.3 * T) + (0.3 * B)

            print("Valid Ingredients:", valid_ingredients)
            # Create product
            product = Product.objects.create(
                product_name=request.data.get('productname'),
                product_type=request.data.get('producttype'),
                category=request.data.get('category'),
                brand_name=request.data.get('brandname'),
                product_link=request.data.get('productlink'),
                volume=request.data.get('volume'),
                chemical_free=request.data.get('chemicalfree') == 'yes',
                packaging_type=request.data.get('packagingtype'),
                price=float(request.data.get('price', 0)),
                in_stock=request.data.get('instock') == 'yes',
                return_period=request.data.get('returnperiod'),
                expiry_date=request.data.get('expirydate'),
                product_description=request.data.get('productdescription'),
                 ingredients_raw= request.data.get('ingredients', ''),
                # ingredients = None,
                product_image=request.FILES.get('productimage'),
                carbon_footprint=total_cf,
                toxicity_score=T,
                biodegradability_score=B,
                ecoscore=ecoscore,
            )
            print("Product created with ID:", product.id)
            print("Ingredients before set:", list(product.ingredients.all()))

            product.ingredients.set(valid_ingredients)  # Link ingredients
            product.save()

            print("Ingredients after set:", list(product.ingredients.all()))

            return JsonResponse({
                "status": "success",
                "product_id": product.id,
                "ecoscore": ecoscore
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            traceback.print_exc()  # Log the full error to console
            return JsonResponse({
                "status": "error",
                "message": str(e),
                "type": type(e).__name__
            }, status=status.HTTP_400_BAD_REQUEST)

class ProductListView(APIView):
    def get(self, request):
        product_type = request.query_params.get('product_type')
        category = request.query_params.get('category')
        
        queryset = Product.objects.all()
        
        if product_type:
            queryset = queryset.filter(product_type=product_type)
        if category:
            queryset = queryset.filter(category=category)
            
        serializer = ProductSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Automatically set from the token
        return Response({
            "username": user.username,
            "name": user.full_name,
            "email": user.email,
            "phone": user.mobile_number,
            "address": user.city_state
        })
    
    def put(self, request):
        user = request.user
        data = request.data

        user.full_name = data.get("name", user.full_name)
        user.email = data.get("email", user.email)
        user.mobile_number = data.get("phone", user.mobile_number)
        user.city_state = data.get("address", user.city_state)
        user.save()

        return Response({"message": "User details updated successfully"}, status=status.HTTP_200_OK)
 
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'

class ProductSearchView(APIView):
    def get(self, request):
        search_query = request.query_params.get('search', '')
        
        if search_query:
            products = Product.objects.filter(
                Q(product_name__icontains=search_query) |
                Q(product_description__icontains=search_query) |
                Q(brand_name__icontains=search_query) |
                Q(category__icontains=search_query)
            )[:20]  # Limit to 20 results for suggestions
        else:
            products = Product.objects.all()[:20]
            
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    print("Request data:", request.data)  # Debug what's received
    print("User:", request.user)
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    try:
        # Check if item already in cart
        cart_item, created = Cart.objects.get_or_create(
            user=request.user,
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()
            
        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart_items(request):
    cart_items = Cart.objects.filter(user=request.user).select_related('product')
    serializer = CartSerializer(cart_items, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def cart_item_detail(request, pk):
    try:
        cart_item = Cart.objects.get(pk=pk, user=request.user)
    except Cart.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CartSerializer(cart_item)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = CartSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        cart_items = Cart.objects.filter(user=user)
        
        if not cart_items.exists():
            return Response(
                {"detail": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate total amount
        total_amount = sum(
            item.product.price * item.quantity for item in cart_items
        )
        
        # Create the order
        order = Order.objects.create(
            user=user,
            amount=total_amount,
            status='Pending'
        )
        
        # Create order items from cart
        for cart_item in cart_items:
            order.items.create(
                product=cart_item.product,
                product_name=cart_item.product.product_name,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
        
        # Clear the user's cart
        cart_items.delete()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')
    
class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)