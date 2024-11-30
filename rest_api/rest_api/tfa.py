from rest_api.models import Tuser
from ninja_extra import exceptions
from rest_api.api import api
from ninja.security import HttpBearer
from ninja_jwt.authentication import JWTBaseAuthentication
from ninja_jwt.exceptions import InvalidToken, AuthenticationFailed
from rest_api import settings
from django.contrib.auth import get_user_model
from os import urandom
from ninja import Form
from django.core.mail import send_mail
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.tokens import TokenError, RefreshToken, AccessToken
from rest_api.jwt import TJWTAuth

def send_otp(otp, email):
    subject = 'OTP Verification'
    message = f"Here's your verification OTP : {otp}"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail( subject, message, email_from, recipient_list)

@api.post("/challenge2fa", auth=JWTAuth())
def challenge2fa(request, otp : Form[int]):
    user = Tuser.objects.filter(username=request.auth).first()
    if (user.tfa_locked == False):
        return {"success" : "Account already unlocked"}
    if (user.tfa == False):
        return {"error":"Please enable 2fa before accessing this page"}
    if (otp == user.tfa_otp):
        user.tfa_locked = False;
    else :
        return {"error":"invalid otp"}
    user.save()
    return {"success" : "Account unlocked"}


@api.post("/enable2fa", auth=TJWTAuth())
def enable2fa(request):
    user = Tuser.objects.filter(username=request.auth).first()
    status = "enabled"
    if not user:
        return ({"error" : "user doens't exist"})
    if (user.tfa == False):
        user.tfa = True;
        user.tfa_locked = False;
    else :
        user.tfa = False;
        status = "disabled"
    user.save()
    return {"Success" :"Two factor authentication is " + status}
