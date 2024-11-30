from ninja import File, Form
from ninja.files import UploadedFile
import socket
from rest_api.settings import UPLOAD_DIR, DEFAULT_IMG
from typing import Optional
from ninja import Schema
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from ninja_jwt.authentication import JWTAuth
from rest_api.models import Tuser
from ninja_jwt.tokens import RefreshToken
from zxcvbn import zxcvbn
from rest_api.settings import REG_EMAIL, REG_XNAME, REG_USER
from rest_api.jwt import TJWTAuth
from django.http import HttpResponse
from rest_api.api import api
import re
from random import getrandbits
from os import urandom
from rest_api.models import Tuser
from rest_api.api import api
from rest_api.jwt import TJWTAuth, send_otp
from ninja import Form
from django.core.mail import send_mail
from ninja_jwt.authentication import JWTAuth


############################ registration utils #################################
class registration_form(Schema):
    username : str
    fname: str
    lname: str
    email: str
    password: str 

class update_form(Schema):
    username : Optional[str] = None
    fname: Optional[str] = None
    lname: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    old_passwd: Optional[str] = None
    bio: Optional[str] = None

def verify_reg(regex, info):
    reg = re.findall(regex, info)
    if (len(reg) != 1 or reg[0] != info):
        return (False)
    return (True)

def verify_reg_infos(reg_form, strict=False):
    if (verify_reg(REG_EMAIL, reg_form.email) == False):
        return {"error": "Email is invalid"}
    if (verify_reg(REG_USER, reg_form.username) == False):
        return {"error": "Username is invalid"}
    if (verify_reg(REG_XNAME, reg_form.fname) == False 
        or verify_reg(REG_XNAME, reg_form.lname) == False):
        return {"error": "First name or Last name is invalid"}
    if (zxcvbn(reg_form.password)["score"] < 3):
        return {"error": "Password isn't string enough make sure to include "
                "Uppercase, numerics and symbols"}
    return {"success": ""}

def upload_img(img):
    content = img.read()
    ext_list = img.name.split(".")
    if (len(ext_list) < 2):
        return (DEFAULT_IMG)
    file_path = (str(getrandbits(128)) + ("." + ext_list[-1]))
    fimg = open(UPLOAD_DIR + file_path, "wb")
    fimg.write(content)
    fimg.close()
    return file_path


############################ registration utils #################################

########################### api endpoints ########################################

@api.get("/self", auth=TJWTAuth())
def self(request):
    user = Tuser.objects.filter(username=request.auth).first()
    if (not user):
        return ({"error" : "User doesn't exist"})
    return ({
        "id" : user.id,
        "username" : user.username,
        "fname" : user.fname,
        "lname" : user.lname,
        "img" : user.image,
        "score" : user.score,
        "reg_date" : user.registeration_date,
        "bio" : user.bio,
        "email" : user.email,
        "status" : "online" if user.uonline == Tuser.ostatus.online else "offline",
        })

@api.get("/user/{str:username}", auth=TJWTAuth())
def users_username(request, username: str):
    user = Tuser.objects.filter(username=username).first()
    cuser = Tuser.objects.filter(username=request.auth).first()
    friends = False
    if (not user):
        return {"error": "User doesn't exist"}
    # checking freindship
    for friend in list(cuser.friends.all()):
        if (friend.id == user.id):
            friends = True
    return ({
        "user_id" : user.id,
        "username" : user.username,
        "fname" : user.fname,
        "lname" : user.lname,
        "img" : user.image,
        "score" : user.score,
        "reg_date" : user.registeration_date,
        "status" : "online" if user.uonline == Tuser.ostatus.online else "offline",
        "bio" : user.bio,
        "friends" : friends
        })

@api.get("/id/{int:id}", auth=TJWTAuth())
def users_id(request, id: int):
    user = Tuser.objects.filter(id=id).first()
    if (not user):
        return {"error": "User doesn't exist"}
    return ({
        "username" : user.username,
        "fname" : user.fname,
        "lname" : user.lname,
        "img" : user.image,
        "score" : user.score,
        "reg_date" : user.registeration_date,
        "status" : "online" if user.uonline == Tuser.ostatus.online else "offline",
        "bio" : user.bio
        })

@api.post("/update", auth=TJWTAuth())
def update(request, form: Form[update_form], img: Optional[UploadedFile] = File(None)):
    print(form.old_passwd, form.username)
    user = Tuser.objects.filter(username=request.auth).first()
    if (not user):
        return {"error": "user doesn't exist"}
    # verifying the email
    if (img != None):
        user.image = upload_img(img)
    if (form.email != None and verify_reg(REG_EMAIL, form.email) == True):
        if (Tuser.objects.filter(email=form.email).first() == None):
            user.email = form.email
            user.verified = False;
            user.tmp_otp = int.from_bytes(urandom(2))
            user.save()
            send_otp(user.tmp_otp, user.email)
        else :
            return {"error" : "Email is already used"}
    elif (form.email != None) :
        return {"error" : "Email isn't valid"}

    if (form.username != None and verify_reg(REG_USER, form.username) == True):
        if (Tuser.objects.filter(username=form.username).first() == None):
            user.username = form.username
        else :
            return {"error" : "Username already used"}
    elif (form.username != None) :
        return {"error" : "Username isn't valid"}

    if (form.fname != None and verify_reg(REG_XNAME, form.fname) == True):
        user.fname = form.fname
    elif (form.fname != None) :
        return {"error" : "First name isn't valid"}

    if (form.lname != None and verify_reg(REG_XNAME, form.lname) == True):
        user.lname = form.lname
    elif (form.lname != None) :
        return {"error" : "Last name isn't valid"}

    if (form.bio != None):
        user.bio = form.bio

    if (form.old_passwd != None):
        if (form.password != None):
            if (check_password(form.old_passwd, user.password_hash) != True):
                return {"error" : "User's old password does't match the new password"}
            if (zxcvbn(form.password)["score"] < 3):
                return {"error" : "User's new password is weak"}
            else :
                user.password_hash = make_password(form.password)
    else :
        return {"error" : "User's password not provided"}

    user.save()
    return {"success": "User's informations are updated"}

@api.post("/register")
def register(request, response : HttpResponse, form: Form[registration_form]):
    status = verify_reg_infos(form)
    if ("error" in status):
        return (status)
    if (len(Tuser.objects.filter(username=form.username)) > 0 or
        len(Tuser.objects.filter(email=form.email)) > 0 ):
        return {"error" : "duplicated account"};
    user = Tuser( username=form.username, 
                    fname=form.fname,
                    lname=form.lname,
                    email=form.email,
                    password_hash=make_password(form.password),
                    tmp_otp=int.from_bytes(urandom(2)),
                    image = DEFAULT_IMG
            )
    if ("@lmongol.lol" in form.email):
        user.verified = True;
    user.save()
    if ("@lmongol.lol" not in form.email):
        send_otp(user.tmp_otp, user.email)
    refresh_token = RefreshToken.for_user(user)
    access_token = refresh_token.access_token.__str__()
    response["Set-Cookie"] = "refresh_token=" + refresh_token.__str__() + "; Path=/; HttpOnly"
    return {"token": access_token}

@api.post("/login")
def login(request, response : HttpResponse, username: Form[str], password: Form[str]):
    account = Tuser.objects.filter(username=username).first()
    if (not account):
        account = Tuser.objects.filter(email=username).first()
        if (not account):
            return {"error" : "Unvalid username or password"}
    if (check_password(password, account.password_hash) == True):
        # killing all old access tokens
        refresh_token = RefreshToken.for_user(account)
        access_token = refresh_token.access_token.__str__()
        if (account.tfa == True):
            account.tfa_otp = int.from_bytes(urandom(2))
            send_otp(account.tfa_otp, account.email)
            account.save() 
        response["Set-Cookie"] = "refresh_token=" + refresh_token.__str__() + "; Path=/; HttpOnly"
        return {"token": access_token, "locked": True if account.tfa == True else False}
    return {"error" : "Unvalid username or password"}

@api.post("/logout", auth=TJWTAuth())
def logout(request, response : HttpResponse):
    token = request.auth
    # here we kill the refresh token so all the access token will die by time
    if ("refresh_token" not in request.COOKIES):
        return ({"error" : "user have no refresh token, please login"})
    user = Tuser.objects.filter(username=request.auth).first()
    try : 
        token = RefreshToken(request.COOKIES.get("refresh_token"))
        token.blacklist()
        if (user.tfa == True):
            user.tfa_locked = True;
            user.tfa_otp = 0;
            user.save()
    except :
        return {"error" : "invalid refresh token", "id" : user.id}

    response.headers["Set-Cookie"] = "refresh_token=" + "; Path=/; HttpOnly; Max-Age=-1"
    return ({"success" : "user logged out", "id" : user.id})


@api.post("/verify_otp", auth=JWTAuth())
def verify_otp(request, otp : Form[int]):
    user = Tuser.objects.filter(username=request.auth).first()
    if (user.verified == True):
        return {"success" : "Account already verified"}
    if (otp == user.tmp_otp):
        user.verified = True;
        user.save()
    else :
        return {"error":"invalid otp"}
    return {"success" : "Account verified"}


########################### api endpoints ########################################

################################### tfa ##########################################

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

################################### tfa ##########################################



@api.get("/search/{str:username}", auth=TJWTAuth())
def search_for_user(request, username:str):
    users = Tuser.objects.filter(username__contains=username).all()
    objs = []
    for user in list(users):
        holder = {
            "username": user.username,
            "image": user.image
                }
        objs.append(holder)
    return ({"state": True, "desc":"Request received", "res": objs})


@api.post("/online", auth=TJWTAuth())
def online(request, online:Form[str]):
    user = Tuser.objects.filter(username=request.auth).first()
    if (online == None):
        return {"error" : "can't set user"}
    vonline = False
    if (online == "true"):
        vonline = Tuser.ostatus.online
    elif (online == "false"):
        vonline = Tuser.ostatus.offline
    user.uonline = vonline
    user.save()
    return ({"success" : "user's status is updated"})
