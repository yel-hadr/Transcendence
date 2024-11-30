from rest_api.api import api
import math
import random
from rest_api.settings import BACK_URL, MAX_TOURNAMENT_PLAYERS
from rest_api.models import Tuser, Tournament, Game, Rounds
from rest_api.jwt import TJWTAuth
from base64 import b64encode
from os import urandom
import binascii
from ninja import Form

# todo 
# abort tournament
# send tournament status
# user tournaments stats


# output
# admin 
# can i play
#   reason
# else 
# game's token id

@api.get("/user_tournament_infos", auth=TJWTAuth())
def user_tournament_infos(request, code: str):
    user = Tuser.objects.filter(username=request.auth).first()
    tournament = Tournament.objects.filter(tournament_code=code).first()
    if (not tournament):
        return ({"error" : "tournament not found"})
    status = "disqualified"
    reason = "player not qualified"
    token = None
    last_tournament = tournament.rounds.last()
    if (last_tournament == None):
        return {
            "admin" : Tuser.objects.filter(id=tournament.admin).first().username,
            "status" : "qualified",
            "reason" : "game didn't start yet",
            "token" : None,
            }
    print(last_tournament)
    for game in list(last_tournament.games.all()):
        if (user.id == game.player_a or user.id == game.player_b):
            if (game.status == Game.Status.ongoing):
                status = "qualified"
                reason = "player is in the middle of a game"
                token = game.token 
            elif(game.status == Game.Status.waiting):
                status = "qualified"
                reason = "player is waiting for a game"
                token = game.token
            else :
                user_score = game.players_a_score if (user.id == game.player_a) else game.players_b_score
                rival_score = game.players_b_score if (user.id == game.player_a) else game.players_a_score
                if (user_score > rival_score):
                    status = "qualified"
                    if (len(tournament.rounds.last().games.all()) == 1):
                        reason = "player won the tournament"
                    else :
                        reason = "player won the last match"
                else :
                    reason = "player lost the last match"

    
    return {
            "admin" : Tuser.objects.filter(id=tournament.admin).first().username,

            "status" : status,
            "reason" : reason,
            "token" : token
            }

@api.post("/create_tournament", auth=TJWTAuth())
def create_tournament(request, admin_alias : Form[str]):
    user = Tuser.objects.filter(username=request.auth).first()
    if (user.tournament_code != ""):
        return {"error" : "the user is already hosting a tournament", "tournamentId": user.tournament_code}
    tournament = Tournament.objects.create(admin=user.id)
    tournament.tournament_code = binascii.hexlify(urandom(11)).decode()
    tournament.status = Tournament.Status.waiting
    user.tournament_alias = admin_alias
    tournament.players.add(user)                        # admin is the first player
    tournament.save()
    user.tournament_code = tournament.tournament_code
    user.save()
    return {"success" : f"{tournament.tournament_code}"}

@api.get("/register_to_tournament", auth=TJWTAuth())
def register_to_tournament(request, code : str):
    tournament = Tournament.objects.filter(tournament_code=code).first()
    if (not tournament):
        return {"error" : "Tournament doesn't exist"}
    if (tournament.status != Tournament.Status.waiting):
        return {"error" : "Tournament has already started or already ended"}
    if (len(tournament.players.all()) > MAX_TOURNAMENT_PLAYERS): #rem
        return {"error" : "Tournament has reached its limit"}
    user = Tuser.objects.filter(username=request.auth).first()
    if (tournament.players.filter(id=user.id).first()):
        return {"success" : "Player is already subscribed to the tournament"}
    tournament.players.add(user)
    tournament.save()
    user.tournament_code = code
    user.save()
    return {"success" : "Player registred to the tournament"}

@api.get("/tournament_invite", auth=TJWTAuth())
def tournament_invite(request):
    user = Tuser.objects.filter(username=request.auth).first()
    if (user.tournament_code == ""):
        return {"error" : "User isn't hosting a tournament"}
    return {"success" : user.tournament_code}

# returns all stored tourmanet infos
@api.get("/tournament_infos", auth=TJWTAuth())
def tournament_infos(request, code : str):
    user = Tuser.objects.filter(username=request.auth).first()
    if (code == ""):
        code = user.tournament_code
    tournament = Tournament.objects.filter(tournament_code=code).first()
    if (not tournament):
        return ({"error" : "Tournament doesn't exist"})
    # returning the tournament data
    players = []
    for player in tournament.players.all() :
        players.append({
            "username" : player.username,
            "id" : player.id,
            "img" : player.image,
            "score" : player.score,
            })

    rounds = []
    for round in tournament.rounds.all():
        games = []
        for game in round.games.all():
            gameState = "done"
            if game.status == Game.Status.waiting:
                gameState = "waiting"
            elif game.status == Game.Status.ongoing:
                gameState = "ongoing"
            games.append({
                "token" : game.token,
                "fplayer" : game.player_a,
                "splayer" : game.player_b,
                "fplayer_score" : game.players_a_score,
                "splayer_score" : game.players_b_score,
                "status" : gameState
                })
        rounds.append({f"round" : games})
    tourn_stat = "done"
    if (tournament.status == Tournament.Status.ongoing):
        tourn_stat = "ongoing"
    elif (tournament.status == Tournament.Status.waiting):
        tourn_stat = "waiting"
    result = {
        "Tournament_token" : tournament.tournament_code,
        "status" : tourn_stat,
        "players" : players,
        "rounds" : rounds,
        "admin" : tournament.players.first().username,
        "date" : tournament.date
             }
    if (tournament.rounds.last() == None):
        return (result)
    if (len(tournament.rounds.last().games.all()) == 1 and tournament.rounds.last().games.last().status == Tournament.Status.done):
        last_game = tournament.rounds.last().games.last()
        if (last_game.players_a_score > last_game.players_b_score):
            result["winner"] = {"user_id" : last_game.player_a }
        else :
            result["winner"] = {"user_id" : last_game.player_b}
    return (result)

@api.get("/user_tournaments", auth=TJWTAuth())
def user_tournaments(request):
    user = Tuser.objects.filter(username=request.auth).first()
    tournaments = Tournament.objects.filter(players=user).all()
    tourns = []
    for tournament in tournaments:
        tourns.append({"tournament_token" : tournament.tournament_code})
    return ({"success" : tourns})

def is_power_of(n, x):
    if n <= 0 or x <= 1:
        return False
    log_result = math.log(n, x)
    return log_result.is_integer()


@api.post("/start_tournament", auth=TJWTAuth())
def start_tournament(request):
    user = Tuser.objects.filter(username=request.auth).first()
    tournament = Tournament.objects.filter(tournament_code=user.tournament_code).first()
    if (not tournament):
        return ({"error" : "Tournament doesn't exist"})
    if (tournament.admin != user.id):
        return {"error" : "please ask the admin to start the tournament"}
    if (len(tournament.players.all()) != MAX_TOURNAMENT_PLAYERS ): #rem
        return ({"error" : "Still waiting for the players to pair up"})
    if (tournament.status != Tournament.Status.waiting):
        return {"error" : "Tournament is either already done or is still going"}
    tournament.status = Tournament.Status.ongoing
    shuffled = []
    for player in tournament.players.all():
        shuffled.append(player.id)
    random.shuffle(shuffled)
    first_round = Rounds()
    first_round.save()
    i = 0;
    while i < len(shuffled):
        game = Game(player_a=shuffled[i], player_b=shuffled[i + 1], token=binascii.hexlify(urandom(10)).decode())
        game.save()
        first_round.games.add(game)
        i += 2
    first_round.save()
    tournament.rounds.add(first_round)

    tournament.save()
    return ({"success" : "tournament has started"})

@api.post("/next_round", auth=TJWTAuth())
def next_round(request, tournament_code: Form[str]):
    tournament = Tournament.objects.filter(tournament_code=tournament_code).first()   
    user = Tuser.objects.filter(username=request.auth).first()
    if (tournament.admin != user.id):
        return {"error" : "please ask the admin to procceed to the next round"}
    for game in tournament.rounds.last().games.all():
        if (game.status != Game.Status.done):
            return {"error" : "games are still ongoing"}
    if (len(tournament.rounds.last().games.all()) == 1):
        for user in tournament.players.all():
            user.tournament_code = ""
            user.save()
        return ({"error" : "tournament has ended"})
    next_round = Rounds.objects.create()
    i = 0
    last_round = tournament.rounds.last().games.all()
    while (i < len(last_round)):
        game = Game.objects.create()
        game.player_a = last_round[i].player_a if (last_round[i].players_a_score > last_round[i].players_b_score) else last_round[i].player_b
        i += 1
        game.player_b = last_round[i].player_a if (last_round[i].players_a_score > last_round[i].players_b_score) else last_round[i].player_b
        game.token=binascii.hexlify(urandom(11)).decode()
        game.save()
        next_round.games.add(game)
        i += 1
    next_round.save()
    tournament.rounds.add(next_round)
    tournament.save()
    return ({"success" : "next round is created"})
    
@api.post("/abort_tournament", auth=TJWTAuth())
def abort_tournament(request, tournament_code: Form[str]):
    tournament = Tournament.objects.filter(tournament_code=tournament_code).first()
    user = Tuser.objects.filter(username=request.auth).first()
    if (not tournament):
        return {"error" : "Tournament doesn't exist"}
    if (tournament.status == Tournament.Status.done):
        return {"error" : "Tournament is already done, you can't abort it"}
    if (user.id != tournament.admin):
        return {"error" : "Only admin can abort the tournament"}
    for round in list(tournament.rounds.all()):
        for game in list(round.games.all()):
            game.delete()
        round.delete()
    for user in tournament.players.all():
        user.tournament_code = ""
        user.save()
    tournament.delete()
    return ({"success" : "Tournament aborted successfully"})

