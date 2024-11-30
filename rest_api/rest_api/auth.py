from rest_api.models import Tuser
from django.http import JsonResponse, HttpResponse
from rest_api.api import api
from random import getrandbits
from ninja import Form
from rest_api import settings
from ninja_jwt.tokens import RefreshToken
import requests

def get_user_info(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(settings.API_42_USER_INFO_URL, headers=headers)
    return response.json()

@api.get("/callback")
def callback(request, code:str, response : HttpResponse):
    token_url = settings.API_42_TOKEN_URL

    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.API_42_CLIENT_ID,
        'client_secret': settings.API_42_CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.API_42_REDIRECT_URI,
    }

    responsex = requests.post(token_url, data=data)
    token_info = responsex.json()
    if 'access_token' in token_info:
        user_info = get_user_info(token_info['access_token'])
        user = Tuser.objects.filter(username=user_info["login"]).first()
        if (not user):
            # downloading the image
            img_data = requests.get(user_info["image"]["link"]).content
            img_npath = str(getrandbits(128)) + "." + user_info["image"]["link"].split(".")[-1]
            img_path = settings.UPLOAD_DIR + img_npath
            img_file = open(img_path, "wb")
            img_file.write(img_data)
            img_file.close()
            # got user's infos now we log them
            user = Tuser(username=user_info["login"], email=user_info["email"],
                         fname=user_info["first_name"], lname=user_info["last_name"],
                         verified=True, image=img_npath)
            user.save()
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token.__str__()
        response["Set-Cookie"] = "refresh_token=" + refresh_token.__str__() + "; Path=/; HttpOnly"
        return {"token": access_token}

    else:
        return {"error": "can't login, please contact bocal"}

@api.get("/auth/42")
def auth_login(request):
    auth_url = f"{settings.API_42_AUTHORIZE_URL}?client_id={settings.API_42_CLIENT_ID}&redirect_uri={settings.API_42_REDIRECT_URI}&response_type=code"
    return {"success" : auth_url}
