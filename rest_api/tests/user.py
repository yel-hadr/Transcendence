import requests
import random
from string import ascii_lowercase as al
import json

API_ADMIN="lmongollhorpix"
API_PASS="x6511phMqoYu3i5KbW3ZamWu3YLjn"
BASE_URL = "https://10.11.4.9/api"
DEFPASS = "Badtripasat789#"

def update(user = None, email = None, opass = None, npass = None, img = None, bio = None, fname = None, lname = None, token = ""):
    data = {}
    headers = {"Authorization" : f"Bearer {token}"}
    if (bio != None):
        data["bio"] = bio
    if (npass != None):
        data["password"] = npass;
    if (opass != None):
        data["old_passwd"] = opass;
    if (user != None):
        data["username"] = user
    if (email != None):
        data["email"] = email
    if (fname != None):
        data["fname"] = fname
    if (lname != None):
        data["lname"] = fname

    r = None
    img_data = None
    if (img != None):
        with open(img, 'rb') as f:
            img_data = f.read()

    files = {"img": (img, img_data)}
    if (img != None):
        r = requests.post(BASE_URL + '/update', data=data, headers=headers, files=files)
    else : 
        r = requests.post(BASE_URL + '/update', data=data, headers=headers)
    return (json.loads(r.text))
    

def id(user_id, atoken):
    headers = {"Authorization" : f"Bearer {atoken}"}
    r = requests.get( BASE_URL + "/id/" + str(user_id), headers=headers)
    return json.loads(r.text)

def user(user, atoken):
    headers = {"Authorization" : f"Bearer {atoken}"}
    r = requests.get( BASE_URL + "/user/" + user, headers=headers)
    return json.loads(r.text)

def register (username, email=None, passw=DEFPASS):
    if (email == None):
        email = username + "@lmongol.lol"
    data = {
            "username" : username,
            "fname" : username,
            "lname" : username,
            "email" : email,
            "password" : passw,
            }
    r = requests.post(BASE_URL + '/register', data=data,verify=False)
    data = json.loads(r.text)
    try : 
        data["rtoken"] = r.headers["Set-Cookie"].split("=")[1].split(";")[0]
    except : 
        return(data)
    return(data)

def login (username, passw=DEFPASS):
    data = {
            "username" : username,
            "password" : passw,
            }
    r = requests.post(BASE_URL + '/login', data=data,verify=False)
    return(json.loads(r.text))

def logout (atoken, rtoken):
    headers = {"Authorization" : f"Bearer {atoken}"}
    r = requests.post(BASE_URL + '/logout', headers=headers, cookies={"refresh_token" : rtoken})
    return(json.loads(r.text))

def selfx (atoken):
    headers = {"Authorization" : f"Bearer {atoken}"}
    r = requests.get(BASE_URL + '/self', headers=headers)
    return(json.loads(r.text))

def enable2fa(atoken):
    headers = {"Authorization" : f"Bearer {atoken}"}
    r = requests.post(BASE_URL + '/enable2fa', headers=headers)
    return(json.loads(r.text))

def genrandstr(lenx):
    strx = ""
    for i in range(lenx):
        strx += al[random.randint(0, len(al) - 1)]
    return (strx)

def online(tok, online):
    headers = {"Authorization" : f"Bearer {tok}"}
    data = {
            "online" : online
            }
    r = requests.post(BASE_URL + '/online', headers=headers, data=data)
    return(json.loads(r.text))
