from django.urls import path
from .views import adaptive_login, verify_otp, verify_security_questions, setup_security_questions, get_security_questions

urlpatterns = [
    path("login/", adaptive_login),
    path("verify-otp/", verify_otp),
    path("verify-questions/", verify_security_questions),
    path("setup-security/", setup_security_questions),
    path("get-security-questions/", get_security_questions),
]
