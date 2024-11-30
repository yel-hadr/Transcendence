import requests
import time
import string
from pwn import log, context
import random
import json

API_ADMIN="lmongollhorpix"
API_PASS="x6511phMqoYu3i5KbW3ZamWu3YLjn"
BASE = "http://localhost:8000/api"
DEFPASS = "7UB&hlqj5x3;S492J!CM"
class User:
    username : str
    fname : str
    lname : str
    password : str
    email : str
    atoken : str
    rtoken : str
    def __init__(self, username, fname, lname, email, password):
        self.username = username
        self.fname = fname
        self.lname = lname
        self.email = email
        self.password = password
    def serialize(self):
        data={
            "username" : self.username,
            "fname" : self.fname,
            "lname" : self.lname,
            "email" : self.email,
            "password" : self.password
            }
        return data

users = []

def rstr(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return (result_str)

def register():
    URL = BASE + "/register"
    username = rstr(10)
    usr =  User(username, username, username, username+"@lmongol.lol", DEFPASS)
    r = requests.post(URL, data=usr.serialize())
    usr.atoken = json.loads(r.text)["token"]
    usr.rtoken = r.headers["Set-Cookie"].split("=")[1].split(";")[0]
    users.append(usr)
    log.info(f"user {username} is created")

def login(username, password):
    URL = BASE + "/login"
    usr =  User(username, username, username, username+"@lmongol.lol", password)
    r = requests.post(URL, data=usr.serialize())
    usr.atoken = json.loads(r.text)["token"]
    log.info(f"user {username} is logged")
    return (usr)

def logout(access_token, refresh_token):
    headers = {"Authorization" : f"Bearer {access_token}"}
    cookies = {"refresh_token": refresh_token}
    r = requests.post(BASE + "/logout", headers=headers, cookies=cookies)
    response = json.loads(r.text)
    if ("success" in response):
        log.success("user is successfully logged out")
    else :
        log.error(f"user isnt logged out {response['error']}")

def search_by_id(usr, id):
    headers = {"Authorization" : f"Bearer {usr.atoken}"}
    cookies = {"refresh_token": usr.rtoken}
    r = requests.get(BASE + f"/id/{id}", headers=headers, cookies=cookies)
    return (r.text)

def leaderboard(usr):
    headers = {"Authorization" : f"Bearer {usr.atoken}"}
    cookies = {"refresh_token": usr.rtoken}
    r = requests.get(BASE + f"/leaderboard", headers=headers, cookies=cookies)
    return (r.text)

register()
# log.info("getting data to check if the token is working")
# print(search_by_id(users[0], 1))
# log.info("well its kinda working, logging out")
# # logout(users[0].atoken, users[0].rtoken)
# # log.info("logged out")
# time.sleep(65)
# log.info("attempting to reach for the new refreshed data")
# print(search_by_id(users[0], 1))
# log.info("alright")

def check_users():
    for i in range(1, 100):
        print(search_by_id(users[0], i))

check_users()

