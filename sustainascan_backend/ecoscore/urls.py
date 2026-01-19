from django.urls import path
from .views import calculate_ecoscore
from .views import get_alternative_products
from . import views

from .views import scan_barcode

urlpatterns = [
    path('', calculate_ecoscore, name='calculate_ecoscore'),
    path('api/products/', views.get_alternative_products, name='alternative_products'),


    path("scan-barcode/", scan_barcode, name="scan-barcode"),
]