from django.urls import path
from .views import (
    UserRegistrationView,
    LoginView,
    AddProductView,
    ProductListView,
    UserProfileView,
    ProductDetailView,
    ReviewViewSet,
    add_to_cart,
    get_cart_items,
    cart_item_detail,
    OrderCreateView,
    OrderListView,
    OrderDetailView,
    UserOrderListView
)

urlpatterns = [
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/admin/add-products/', AddProductView.as_view(), name='add_product'),
    path('api/products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('api/user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/accounts/cart-items/', get_cart_items, name='cart_items'),
    path('cart-items/<int:pk>/', cart_item_detail, name='cart_item_detail'),
    path('api/accounts/add-to-cart/', add_to_cart, name='add_to_cart'),
    path('api/cart/add/', add_to_cart, name='add_to_cart'),
    path('api/cart/items/', get_cart_items, name='cart_items'),
    path('api/cart/items/<int:pk>/', cart_item_detail, name='cart_item_detail'),
    # reviews
    path('api/products/<int:product_id>/reviews/', ReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='product-reviews'),
    path('api/products/<int:product_id>/reviews/<int:pk>/', ReviewViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='review-detail'),
     # Orders
    path('api/orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('api/orders/', OrderListView.as_view(), name='order-list'),  # Admin view all orders
    path('api/orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),  # Order details
    path('api/user/orders/', UserOrderListView.as_view(), name='user-order-list'),  # User-specific orders
]