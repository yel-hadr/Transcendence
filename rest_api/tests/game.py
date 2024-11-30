import requests
import json
from user import BASE_URL

def game_infos(tok, game_id):
    data = {
            "gid" : game_id,
            }
    r = requests.get(BASE_URL + "/game_infos",headers={"Authorization" : f"Bearer {tok}"} , params=data, verify=False)
    return (json.loads(r.text))

def register_results(tok, game_id):
    data = {
            "gid" : int(game_id),
            }
    r = requests.post(BASE_URL + "/register_results",headers={"Authorization" : f"Bearer {tok}"} , data=data, verify=False)
    return (json.loads(r.text))


def match_history(tok, id):
    data = {
            "id" : int(id),
            }
    r = requests.get(BASE_URL + "/match_history",headers={"Authorization" : f"Bearer {tok}"} , params=data, verify=False)
    return (json.loads(r.text))

def register_goal(tok, game_id, scorer_id):
    data = {
            "game_id" : game_id,
            "scorer_id" : scorer_id,
            }
    r = requests.post(BASE_URL + "/register_goal",headers={"Authorization" : f"Bearer {tok}"} , data=data, verify=False)
    return (json.loads(r.text))


def register_game(tok, id_a, id_b):
    data = {
            "id_a" : id_a,
            "id_b" : id_b,
            }
    r = requests.post(BASE_URL + "/register_game",headers={"Authorization" : f"Bearer {tok}"} , data=data, verify=False)
    return (json.loads(r.text))

def leaderboard(tok):
    r = requests.get(BASE_URL + "/leaderboard",headers={"Authorization" : f"Bearer {tok}"}, verify=False)
    return (json.loads(r.text))

def create_game(tok):
    r = requests.post(BASE_URL + "/create_game",headers={"Authorization" : f"Bearer {tok}"},verify=False)
    return (json.loads(r.text))

def register_togame(tok, game_id):
    params = {
            "game_id" : game_id
            }
    r = requests.get(BASE_URL + "/register_togame",headers={"Authorization" : f"Bearer {tok}"}, params=params,verify=False)
    return (json.loads(r.text))
def abort_game(tok, game_id):
    params = {
            "game_id" : game_id
            }
    r = requests.post(BASE_URL + "/abort_game",headers={"Authorization" : f"Bearer {tok}"}, data=params,verify=False)
    return (json.loads(r.text))
