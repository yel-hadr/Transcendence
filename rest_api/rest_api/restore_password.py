from rest_api.models import Tuser
from ninja_jwt.tokens import RefreshToken
from rest_api.settings import BACK_URL
from rest_api.api import api
from rest_api.tfa import TJWTAuth
from django.contrib.auth.hashers import make_password
from rest_api.user import send_otp, verify_reg
from os import urandom
from zxcvbn import zxcvbn
import base64, binascii
from rest_api.settings import REG_PASS
from ninja import Form

@api.get("/check_token")
def check_token(request, token : str):
    user = Tuser.objects.filter(fp_token=token).first()
    if (not user):
        return {"error" : "Unvalid token"}
    return {"success" : "Valid token"}


@api.post("/restore_password")
def restore_password(request, token : Form[str], passwd : Form[str]):
    user = Tuser.objects.filter(fp_token=token).first()
    if (not user):
        return {"error" : "Unvalid token"}
    if (zxcvbn(passwd)["score"] < 3):
        return {"error" : "Unvalid password"}
    user.password_hash = make_password(passwd)
    user.save()
    return {"success": "password changed"}



@api.post("/forgot_password")
def forgot_password(request, email : Form[str]):
    user = Tuser.objects.filter(email=email).first()
    if (user):
        user.fp_token = binascii.hexlify(urandom(32)).decode()
        send_otp(BACK_URL + "resetPassword?token=" + user.fp_token, user.email)
        user.save()
    return {"success" : "Please check your email"}

@api.post("/delete_account", auth=TJWTAuth())
def delete_account(request):
    user = Tuser.objects.filter(username=request.auth).first()
    if (not user):
        return ({"error" : "user doesn't exist"})
    refresh_token = RefreshToken(request.auth)
    refresh_token.blacklist()
    user.delete()
    return {"success" : "account deleted"}
