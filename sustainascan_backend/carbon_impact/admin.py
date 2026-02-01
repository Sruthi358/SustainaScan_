from django.contrib import admin
from .models import CarbonImpactRecord


@admin.register(CarbonImpactRecord)
class CarbonImpactAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "month",
        "year",
        "electricity_co2",
        "transport_co2",
        "cooking_co2",
        "lifestyle_co2",
        "total_co2",
    )
    list_filter = ("year", "month")
    search_fields = ("user__username",)
