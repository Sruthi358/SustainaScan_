from django.urls import path

from .views import (
    CalculateCarbonImpactView,
    CarbonImpactHistoryView,
    CarbonMonthlyTrendView,
    CarbonCategoryBreakdownView
)

urlpatterns = [
    path('calculate/', CalculateCarbonImpactView.as_view()),
    path('history/', CarbonImpactHistoryView.as_view()),
    path('monthly-trend/', CarbonMonthlyTrendView.as_view()),
    path('category-breakdown/', CarbonCategoryBreakdownView.as_view()),
]
