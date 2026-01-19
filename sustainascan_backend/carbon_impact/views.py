from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from .models import CarbonImpactRecord
from .serializers import CarbonImpactHistorySerializer

def to_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0

class CarbonImpactHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = CarbonImpactRecord.objects.filter(
            user=request.user
        ).order_by('year', 'month')

        serializer = CarbonImpactHistorySerializer(records, many=True)
        return Response(serializer.data)

class CarbonMonthlyTrendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = CarbonImpactRecord.objects.filter(
            user=request.user
        ).order_by('year', 'month')

        data = []
        for r in records:
            data.append({
                "label": f"{r.month}/{r.year}",
                "value": r.total_co2
            })

        return Response(data)

class CarbonCategoryBreakdownView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = CarbonImpactRecord.objects.filter(
            user=request.user
        )

        total_electricity = sum(r.electricity_co2 for r in records)
        total_transport = sum(r.transport_co2 for r in records)
        total_cooking = sum(r.cooking_co2 for r in records)
        total_lifestyle = sum(r.lifestyle_co2 for r in records)

        return Response({
            "Electricity": round(total_electricity, 2),
            "Transport": round(total_transport, 2),
            "Cooking": round(total_cooking, 2),
            "Lifestyle": round(total_lifestyle, 2)
        })

def get_category_and_suggestions(total_co2):
    if total_co2 < 250:
        category = "Low"
        suggestions = [
            "Great job! Your carbon footprint is low.",
            "Continue using public transport or two-wheelers.",
            "Maintain low electricity usage by using LED lights.",
            "Avoid single-use plastics wherever possible.",
            "Track your footprint monthly to stay consistent."
        ]

    elif total_co2 <= 500:
        category = "Medium"
        suggestions = [
            "Try reducing private vehicle usage at least 1–2 days a week.",
            "Switch off appliances when not in use to save electricity.",
            "Reduce LPG usage by cooking efficiently.",
            "Limit air conditioner usage to necessary hours.",
            "Prefer public transport or carpooling where possible."
        ]

    else:
        category = "High"
        suggestions = [
            "Consider shifting from car to public transport or carpooling.",
            "Reduce electricity usage by limiting AC and heavy appliances.",
            "Optimize cooking fuel usage to avoid wastage.",
            "Reduce non-vegetarian food consumption.",
            "Avoid single-use plastic and adopt reusable alternatives."
        ]

    return category, suggestions

class CalculateCarbonImpactView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user
        now = datetime.now()

        # ================= ELECTRICITY =================
        # electricity_units = float(data.get('electricity_units', 0))
        electricity_units = to_float(data.get('electricity_units'))
        electricity_co2 = electricity_units * 0.82  # kg CO2 per unit (India avg)

        # ================= TRANSPORT =================
        bike_km = to_float(data.get('bike_km'))
        car_km = to_float(data.get('car_km'))
        bus_km = to_float(data.get('public_bus_km'))
        auto_km = to_float(data.get('public_auto_km'))
        train_annual_km = to_float(data.get('train_annual_km'))

        # Emission factors (kg CO2 per km)
        BIKE = 0.10
        CAR = 0.21
        BUS = 0.05
        AUTO = 0.07
        TRAIN = 0.02

        transport_co2 = (
            bike_km * BIKE +
            car_km * CAR +
            bus_km * BUS +
            auto_km * AUTO +
            (train_annual_km / 12) * TRAIN
        )

        # ================= COOKING =================
        cooking_co2 = 0
        cooking_fuel = data.get('cooking_fuel')

        if cooking_fuel == 'LPG':
            # cylinders = float(data.get('lpg_cylinders_per_month', 0))
            cylinders = to_float(data.get('lpg_cylinders_per_month'))
            cooking_co2 = cylinders * 42  # 1 LPG ≈ 42 kg CO2

        # ================= LIFESTYLE =================
        lifestyle_co2 = 0
        if data.get('uses_ac'):
            lifestyle_co2 += 60
        if data.get('eats_non_veg'):
            lifestyle_co2 += 50
        if data.get('uses_plastic_daily'):
            lifestyle_co2 += 30

        # ================= TOTAL =================
        total_co2 = (
            electricity_co2 +
            transport_co2 +
            cooking_co2 +
            lifestyle_co2
        )

        category, suggestions = get_category_and_suggestions(total_co2)

        # ================= SAVE =================
        CarbonImpactRecord.objects.update_or_create(
            user=user,
            month=now.month,
            year=now.year,
            defaults={
                'electricity_units': electricity_units,
                'electricity_co2': electricity_co2,
                'transport_co2': transport_co2,
                'cooking_fuel': cooking_fuel,
                'lpg_cylinders_per_month': data.get('lpg_cylinders_per_month'),
                'cooking_co2': cooking_co2,
                'uses_ac': data.get('uses_ac'),
                'eats_non_veg': data.get('eats_non_veg'),
                'uses_plastic_daily': data.get('uses_plastic_daily'),
                'lifestyle_co2': lifestyle_co2,
                'total_co2': total_co2,
            }
        )
    
        return Response({
            "message": "Carbon footprint calculated successfully",
            "electricity_co2": round(electricity_co2, 2),
            "transport_co2": round(transport_co2, 2),
            "cooking_co2": round(cooking_co2, 2),
            "lifestyle_co2": round(lifestyle_co2, 2),
            "total_co2": round(total_co2, 2),
            "category": category,
            "suggestions": suggestions
        })