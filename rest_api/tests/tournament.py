import requests
import json
from user import BASE_URL

def create_tournament(tok, alias):
    data = {"admin_alias": alias}
    r = requests.post(BASE_URL + "/create_tournament",headers={"Authorization" : f"Bearer {tok}"} , data=data, verify=False)
    return (json.loads(r.text))

def register_to_tournament(tok, code):
    data = {"code" : code }
    r = requests.get(BASE_URL + "/register_to_tournament",headers={"Authorization" : f"Bearer {tok}"} , params=data, verify=False)
    return (json.loads(r.text))

def tournament_invite(tok):
    r = requests.get(BASE_URL + "/tournament_invite",headers={"Authorization" : f"Bearer {tok}"}, verify=False)
    return (json.loads(r.text))

def set_alias(tok, alias):
    data = {"alias": alias}
    r = requests.post(BASE_URL + "/set_alias",headers={"Authorization" : f"Bearer {tok}"}, data=data, verify=False)
    return (json.loads(r.text))

def tournament_infos(tok, code):
    data = {"code": code}
    r = requests.get(BASE_URL + "/tournament_infos",headers={"Authorization" : f"Bearer {tok}"}, 
                     params=data, verify=False)
    return (json.loads(r.text))

def start_tournament(tok):
    r = requests.post(BASE_URL + "/start_tournament",headers={"Authorization" : f"Bearer {tok}"}, verify=False)
    return (json.loads(r.text))

def next_round(tok, tournament_code):
    data = {"tournament_code": tournament_code}
    r = requests.post(BASE_URL + "/next_round",headers={"Authorization" : f"Bearer {tok}"}, data=data, verify=False)
    return (json.loads(r.text))


