from django.db import models
from django.conf import settings

# from django.contrib.auth.models import User

class UserSecurityProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    trusted_device = models.CharField(max_length=256, null=True, blank=True)
    trusted_location = models.CharField(max_length=100, null=True, blank=True)
    failed_attempts = models.IntegerField(default=0)
    successful_logins = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username


class SecurityQuestion(models.Model):
    QUESTIONS = [
        ("sign", "What is your Zodiac Sign?"),
        ("city", "What is your birth city?"),
        ("school", "What is your first school name?"),
        ("sibling", "How many siblings do you have?"),
        ("friend", "What is your bestfriend name?"),
        ("mother", "What is your mother’s first name?")
    ]

    # user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="security_questions"
    )


    question_key = models.CharField(max_length=20, choices=QUESTIONS)
    answer = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username} - {self.question_key}"


class OTP(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    otp = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)



# class OTP(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     otp = models.CharField(max_length=6)
#     is_verified = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)  # ✅ REQUIRED
