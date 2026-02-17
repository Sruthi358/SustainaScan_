from django.contrib import admin
from .models import UserSecurityProfile, OTP, TrustedDevice, SecurityQuestion

@admin.register(UserSecurityProfile)
class UserSecurityProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "failed_attempts",
        "successful_logins",
    )
    search_fields = ("user__username",)

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

@admin.register(TrustedDevice)
class TrustedDeviceAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "device_fingerprint",
        "location",
        "last_used",
    )
    search_fields = ("user__username", "location", "device_fingerprint")
    list_filter = ("location", "last_used")

@admin.register(SecurityQuestion)
class SecurityQuestionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "question_key",
        "answer",
    )
    search_fields = ("user__username", "question_key")
    list_filter = ("question_key",)
