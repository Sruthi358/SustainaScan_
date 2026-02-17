import random
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import User
from django.db import transaction
from datetime import datetime
from .models import UserSecurityProfile, OTP, SecurityQuestion
from .risk_engine import calculate_risk
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import send_otp
import json, random

from .models import TrustedDevice


User = get_user_model()

# @csrf_exempt
# @transaction.atomic   # 🔴 IMPORTANT
# def setup_security_questions(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Invalid request"}, status=400)

#     try:
#         data = json.loads(request.body.decode("utf-8"))

#         user_id = int(data.get("user_id"))
#         q1 = data.get("q1")
#         a1 = data.get("a1")
#         q2 = data.get("q2")
#         a2 = data.get("a2")

#         if not all([user_id, q1, a1, q2, a2]):
#             return JsonResponse({"error": "Missing fields"}, status=400)

#         user = User.objects.get(id=user_id)

#         # 🔹 Create profile FIRST
#         UserSecurityProfile.objects.get_or_create(user=user)

#         # 🔹 Clear old questions (important)
#         SecurityQuestion.objects.filter(user=user).delete()

#         # 🔹 Create exactly 2 questions
#         SecurityQuestion.objects.create(
#             user=user,
#             question_key=q1,
#             answer=a1
#         )
#         SecurityQuestion.objects.create(
#             user=user,
#             question_key=q2,
#             answer=a2
#         )

#         return JsonResponse({"status": "SECURITY_SETUP_SUCCESS"})

#     except User.DoesNotExist:
#         return JsonResponse({"error": "User not found"}, status=404)

#     except Exception as e:
#         print("MFA SETUP ERROR:", str(e))  # 👈 DEBUG
#         return JsonResponse({"error": "Internal error"}, status=500)

# @csrf_exempt
# @transaction.atomic
# def setup_security_questions(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Invalid request"}, status=400)

#     try:
#         data = json.loads(request.body.decode("utf-8"))

#         q1 = data.get("q1")
#         a1 = data.get("a1")
#         q2 = data.get("q2")
#         a2 = data.get("a2")

#         if not all([q1, a1, q2, a2]):
#             return JsonResponse({"error": "Missing fields"}, status=400)

#         # ✅ USE JWT AUTH USER
#         user = request.user

#         if user.is_anonymous:
#             return JsonResponse({"error": "Unauthorized"}, status=401)

#         UserSecurityProfile.objects.get_or_create(user=user)

#         SecurityQuestion.objects.filter(user=user).delete()

#         SecurityQuestion.objects.create(
#             user=user, question_key=q1, answer=a1
#         )
#         SecurityQuestion.objects.create(
#             user=user, question_key=q2, answer=a2
#         )

#         return JsonResponse({"status": "SECURITY_SETUP_SUCCESS"})

#     except Exception as e:
#         print("MFA SETUP ERROR:", e)
#         return JsonResponse({"error": "Internal error"}, status=500)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from .models import UserSecurityProfile, SecurityQuestion

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def setup_security_questions(request):
    q1 = request.data.get("q1")
    a1 = request.data.get("a1")
    q2 = request.data.get("q2")
    a2 = request.data.get("a2")

    if not all([q1, a1, q2, a2]):
        return Response({"error": "Missing fields"}, status=400)

    user = request.user

    UserSecurityProfile.objects.get_or_create(user=user)

    SecurityQuestion.objects.filter(user=user).delete()

    SecurityQuestion.objects.create(
        user=user, question_key=q1, answer=a1
    )
    SecurityQuestion.objects.create(
        user=user, question_key=q2, answer=a2
    )

    return Response({"status": "SECURITY_UPDATED"})

    
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from .models import SecurityQuestion

User = get_user_model()

# @csrf_exempt
# def get_security_questions(request):
#     user = request.user

#     questions = SecurityQuestion.objects.filter(user=user)[:2]

#     data = []
#     for q in questions:
#         data.append({
#             "question_key": q.question_key,
#             "answer": q.answer
#         })

#     return JsonResponse({
#         "questions": data
#     })

# @csrf_exempt
# def get_security_questions(request):
#     try:
#         data = json.loads(request.body.decode("utf-8")) if request.body else {}
#         user_id = request.user

#         if not user_id:
#             return JsonResponse({"questions": []})

#         user = User.objects.get(id=user_id)
#         questions = SecurityQuestion.objects.filter(user=user)[:2]

#         return JsonResponse({
#             "questions": [
#                 {
#                     "question_key": q.question_key,
#                     "answer": q.answer
#                 }
#                 for q in questions
#             ]
#         })

#     except Exception as e:
#         return JsonResponse({"questions": [], "error": str(e)})

# @csrf_exempt
# def get_security_questions(request):
#     user = request.user

#     if user.is_anonymous:
#         return JsonResponse({"questions": []}, status=401)

#     questions = SecurityQuestion.objects.filter(user=user)[:2]

#     return JsonResponse({
#         "questions": [
#             {
#                 "question_key": q.question_key,
#                 "answer": q.answer
#             } for q in questions
#         ]
#     })

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_security_questions(request):
#     questions = SecurityQuestion.objects.filter(user=request.user)[:2]

#     return Response({
#         "questions": [
#             {
#                 "question_key": q.question_key,
#                 "answer": q.answer
#             } for q in questions
#         ]
#     })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_security_questions(request):
    questions = SecurityQuestion.objects.filter(user=request.user)[:2]

    return Response({
        "questions": [
            {
                "question_key": q.question_key,
                "answer": q.answer
            } for q in questions
        ]
    })



@csrf_exempt
def verify_otp(request):
    data = json.loads(request.body.decode("utf-8"))

    otp = data.get("otp")
    user_id = data.get("user_id")

    record = OTP.objects.filter(
        user_id=user_id,
        otp=str(otp),
        is_verified=False
    ).last()

    if not record:
        return JsonResponse({"error": "Invalid OTP"}, status=401)

    record.is_verified = True
    record.save()

    user = User.objects.get(id=user_id)
    profile = UserSecurityProfile.objects.get(user=user)

    # profile.trusted_device = data.get("device_fingerprint")
    # profile.trusted_location = data.get("location")

    # device = data.get("device_fingerprint")
    # location = data.get("location")
    device = data.get("device_fingerprint", "").strip()
    location = data.get("location", "").strip().lower()


    TrustedDevice.objects.get_or_create(
        user=user,
        device_fingerprint=device,
        location=location
    )

    profile.failed_attempts = 0
    profile.successful_logins += 1
    profile.save()

    # ✅ ISSUE TOKENS
    refresh = RefreshToken.for_user(user)

    return JsonResponse({
        "status": "OTP_VERIFIED",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_staff
        }
    })

@csrf_exempt
def verify_security_questions(request):
    data = json.loads(request.body.decode("utf-8"))
    user_id = data.get("user_id")

    user = User.objects.get(id=user_id)
    questions = SecurityQuestion.objects.filter(user=user)[:2]

    for q in questions:
        if data.get(q.question_key, "").lower() != q.answer.lower():
            return JsonResponse({"error": "Wrong answer"}, status=401)

    refresh = RefreshToken.for_user(user)

    return JsonResponse({
        "status": "LOGIN_SUCCESS",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_staff
        }
    })

@csrf_exempt
def adaptive_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    data = json.loads(request.body.decode("utf-8"))
    username = data.get("username")
    password = data.get("password")

    # Step 1: Authenticate
    user = authenticate(username=username, password=password)

    # ❌ Wrong password
    if not user:
        try:
            existing_user = User.objects.get(username=username)
            profile, _ = UserSecurityProfile.objects.get_or_create(user=existing_user)
            profile.failed_attempts += 1
            profile.save()
        except User.DoesNotExist:
            pass

        return JsonResponse({
            "status": "INVALID_CREDENTIALS",
            "error": "Invalid username or password"
        }, status=401)

    # ✅ Correct password
    profile, _ = UserSecurityProfile.objects.get_or_create(user=user)

    risk_data = {
        "location": data.get("location"),
        "device": data.get("device_fingerprint"),
        "hour": datetime.now().hour
    }

    # -----------------------------
# ADAPTIVE MFA RULE ENGINE
# -----------------------------

    risk = 0

    # is_new_device = (
    #     profile.trusted_device and
    #     profile.trusted_device != data.get("device_fingerprint")
    # )

    # device = data.get("device_fingerprint")
    # location = data.get("location")
    device = data.get("device_fingerprint", "").strip()
    location = data.get("location", "").strip().lower()


    is_trusted = TrustedDevice.objects.filter(
        user=user,
        device_fingerprint=device,
        location=location
    ).exists()

    is_new_device = not is_trusted


    # 🔴 Rule 3: Any device + ≥3 failures → HIGH RISK
    if profile.failed_attempts >= 3:
        risk = 80

    # 🟡 Rule 1: New device → OTP even with 0 or 1 failure
    elif is_new_device:
        risk = 40

    # 🟡 Rule 2: Trusted device + 2 failures → OTP
    elif profile.failed_attempts == 2:
        risk = 40

    # 🟢 Else → LOW RISK
    else:
        risk = 0

    if risk < 30:
        profile.failed_attempts = 0
        profile.successful_logins += 1
        profile.trusted_device = risk_data["device"]
        profile.trusted_location = risk_data["location"]
        profile.save()

        TrustedDevice.objects.get_or_create(
            user=user,
            device_fingerprint=device,
            location=location
        )


        # ✅ ISSUE JWT TOKENS (OLD LOGIN STYLE)
        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            "status": "SUCCESS",
            "level": "LOW",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_staff
            }
        })

    # 🟡 / 🔴 OTP required
    otp = str(random.randint(100000, 999999))
    OTP.objects.filter(user=user).delete()
    OTP.objects.create(user=user, otp=otp)

    # send_otp(user.email, otp)
    try:
        send_otp(user.email, otp)
    except Exception as e:
        print("EMAIL OTP FAILED:", e)


    return JsonResponse({
        "status": "OTP_REQUIRED",
        "level": "HIGH" if risk >= 60 else "MEDIUM",
        "user_id": user.id
    })