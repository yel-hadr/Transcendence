from ninja.security import HttpBearer
from ninja_jwt.authentication import JWTBaseAuthentication
from ninja_jwt.exceptions import InvalidToken, AuthenticationFailed
from django.contrib.auth import get_user_model
from ninja_extra import exceptions
from os import urandom
from ninja_jwt.tokens import TokenError, RefreshToken
from rest_api.models import Tuser
from rest_api import settings
import json
from django.core.mail import send_mail
import requests

################################ jwt tools ######################################
class RefreshTokenEXP(exceptions.AuthenticationFailed):
    token = ""
    def __init__(self, token=None) -> None:
        access_token = {"token" : token}
        super().__init__(access_token)

class ErrorEXP(exceptions.AuthenticationFailed):
    token = ""
    def __init__(self, token=None) -> None:
        access_token = {"error" : token}
        super().__init__(access_token)

User = get_user_model()
class TJWTAuth(HttpBearer):
    def authenticate(self, request, token):
        jwt_auth = JWTBaseAuthentication()

        try:
            validated_token = jwt_auth.get_validated_token(token)
            userx = jwt_auth.get_user(validated_token)
            user = Tuser.objects.filter(username=userx).first()

            if (not user):
                raise ErrorEXP("User not found.")

            if (user.verified == False):
                raise ErrorEXP("User not verified")
            
            if (user.tfa_locked == True and user.tfa == True):
                user.tfa_otp = int.from_bytes(urandom(2))
                send_otp(user.tfa_otp, user.email)
                user.save()
                raise ErrorEXP("Account is 2fa locked")


            return user

        except InvalidToken:
            if ("refresh_token" in request.COOKIES):
                rtok = None
                try : 
                    rtok = RefreshToken(request.COOKIES.get("refresh_token"))
                    user = Tuser.objects.filter(id=rtok.get('user_id')).first()
                    if user:
                        user.is_locked = True
                        user.save()
                except : 
                    raise ErrorEXP("Invalid or expired token token.")
                raise RefreshTokenEXP(rtok.access_token.__str__())
        except User.DoesNotExist:
            raise ErrorEXP("User not found.")
        except TokenError:
            raise ErrorEXP("Please login again.")

class AJWTAuth(HttpBearer):
    def authenticate(self, request, token):
        jwt_auth = JWTBaseAuthentication()

        try:
            validated_token = jwt_auth.get_validated_token(token)
            userx = jwt_auth.get_user(validated_token)
            user = Tuser.objects.filter(username=userx).first()

            if (not user):
                raise ErrorEXP("User not found.")

            if (user.verified == False):
                raise ErrorEXP("User not verified")
            if (user.id != 1):
                raise ErrorEXP("Not an Admin")
            return user

        except InvalidToken:
            if ("refresh_token" in request.COOKIES):
                rtok = None
                try : 
                    rtok = RefreshToken(request.COOKIES.get("refresh_token"))
                    user = Tuser.objects.filter(id=rtok.get('user_id')).first()
                    if user:
                        user.is_locked = True
                        user.save()
                except : 
                    raise ErrorEXP("Invalid or expired token token.")
                raise RefreshTokenEXP(rtok.access_token.__str__())
        except User.DoesNotExist:
            raise ErrorEXP("User not found.")
        except TokenError:
            raise ErrorEXP("Please login again.")

################################ jwt tools ######################################


def send_otp(otp, email):
    subject = 'OTP Verification'
    message = f"Here's your verification OTP : {otp}"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail( subject, message, email_from, recipient_list)


