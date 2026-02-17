from django.core.mail import send_mail
from django.conf import settings

def send_otp(email, otp):
    send_mail(
        "SustainaScan Login OTP",
        f"Your OTP is {otp}. Valid for 5 minutes.",
        "noreply@sustainascan.com",
        [email],
        fail_silently=False,
    )