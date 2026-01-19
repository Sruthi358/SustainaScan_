from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class CarbonImpactRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    month = models.PositiveSmallIntegerField()
    year = models.PositiveSmallIntegerField()

    # Electricity
    electricity_units = models.FloatField()
    electricity_co2 = models.FloatField()

    # Transport (final calculated value only)
    transport_co2 = models.FloatField()

    # Cooking
    cooking_fuel = models.CharField(max_length=20)
    lpg_cylinders_per_month = models.FloatField(null=True, blank=True)
    cooking_co2 = models.FloatField()

    # Lifestyle
    uses_ac = models.BooleanField(default=False)
    eats_non_veg = models.BooleanField(default=False)
    uses_plastic_daily = models.BooleanField(default=False)
    lifestyle_co2 = models.FloatField()

    # Total
    total_co2 = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'month', 'year')

    def __str__(self):
        return f"{self.user} - {self.month}/{self.year}"
