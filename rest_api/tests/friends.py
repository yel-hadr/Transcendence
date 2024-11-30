import requests
import json
from user import BASE_URL

def friends(tok):
    r = requests.get(BASE_URL + '/friends', headers={"Authorization" : f"Bearer {tok}"})
    return(json.loads(r.text))

def friend_invs(tok):
    r = requests.get(BASE_URL + '/friend_invs', headers={"Authorization" : f"Bearer {tok}"})
    return(json.loads(r.text))

def accept_inv(tok, username):
    data = {
            "username" : username
            }
    r = requests.post(BASE_URL + '/accept_friend', headers={"Authorization" : f"Bearer {tok}"}, data=data)
    return (json.loads(r.text))

def add_friend(tok, username):
    data = {
            "username" : username
            }
    r = requests.post(BASE_URL + '/add_friend', headers={"Authorization" : f"Bearer {tok}"}, data=data)
    return (json.loads(r.text))
    


