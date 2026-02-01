from django.contrib import admin
from .models import UserSecurityProfile, OTP

@admin.register(UserSecurityProfile)
class UserSecurityProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "trusted_device",
        "trusted_location",
        "failed_attempts",
        "successful_logins",
    )
    search_fields = ("user__username", "trusted_device", "trusted_location")

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "otp",
        "is_verified",
        "created_at",
    )
    list_filter = ("is_verified",)
    search_fields = ("user__username", "otp")
