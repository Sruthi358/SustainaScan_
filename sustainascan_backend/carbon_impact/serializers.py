from rest_framework import serializers
from .models import CarbonImpactRecord


class CarbonImpactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarbonImpactRecord
        fields = '__all__'
        read_only_fields = ['user', 'electricity_co2', 'transport_co2',
                            'cooking_co2', 'lifestyle_co2', 'total_co2']
        


class CarbonImpactHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CarbonImpactRecord
        fields = [
            'month',
            'year',
            'electricity_co2',
            'transport_co2',
            'cooking_co2',
            'lifestyle_co2',
            'total_co2'
        ]
