def calculate_risk(data, profile):
    risk = 0

    if profile.trusted_location and profile.trusted_location != data["location"]:
        risk += 30

    if profile.trusted_device and profile.trusted_device != data["device"]:
        risk += 20

    if data["hour"] < 6 or data["hour"] > 22:
        risk += 10

    if profile.failed_attempts >= 3:
        risk += 30

    if profile.failed_attempts == 0:
        if (
            profile.trusted_location == data["location"] and
            profile.trusted_device == data["device"] and
            profile.successful_logins > 3
        ):
            risk -= 20

    return max(risk, 0)
