import requests
import json
from user import BASE_URL

def create_conv(tok, user):
    data = {"user" : int(user)}
    r = requests.post(BASE_URL + "/create_conv",headers={"Authorization" : f"Bearer {tok}"} , data=data)
    return (json.loads(r.text))

def convos(tok):
    r = requests.get(BASE_URL + "/convos",headers={"Authorization" : f"Bearer {tok}"})
    return (json.loads(r.text))

def messages(tok, conv):
    data = {"conv_id" : int(conv)}
    r = requests.get(BASE_URL + "/messages",headers={"Authorization" : f"Bearer {tok}"}, params=data)
    return (json.loads(r.text))

def register_message(tok, conv_id, message, sender):
    data = {
            "conv_id" : conv_id,
            "message" : message,
            "sender" : sender
            }
    r = requests.post(BASE_URL + "/register_message",headers={"Authorization" : f"Bearer {tok}"} , data=data)
    return (json.loads(r.text))

def block(tok, user_id):
    data = {
            "suer_id" : user_id,
            }
    r = requests.post(BASE_URL + "/block",headers={"Authorization" : f"Bearer {tok}"} , data=data)
    return (json.loads(r.text))
