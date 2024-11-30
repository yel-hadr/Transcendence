from rest_api.api import api
from ninja import Form
from rest_api.jwt import TJWTAuth, AJWTAuth
from rest_api.models import Tuser, Game
import binascii
from os import urandom

@api.post("/create_game", auth=TJWTAuth())
def create_game(request):
    user = Tuser.objects.filter(username=request.auth).first()
    if (user.status == Tuser.status.playing):
        return {"error" : "can't create a game while you're playing another"}
    game = Game(player_a = user.id, status=Game.Status.waiting, token=binascii.hexlify(urandom(11)).decode())
    game.save()
    user.games_played.add(game)
    user.status = Tuser.status.playing
    user.save()
    return ({"success" : f"{game.token}"})

@api.get("/register_togame", auth=TJWTAuth())
def register_togame(request, game_id : str):
    game = Game.objects.filter(token=game_id).first()
    user = Tuser.objects.filter(username=request.auth).first()
    if (not game):
        return ({"error" : "game cannot be found"})
    if (game.player_b == user.id and game.status != Game.Status.done):
        return {"success" : "user already in the game"}
    if (game.status != Game.Status.waiting):
        return {"error" : "game is already started or is already finished"}
    if (game.player_a == user.id):
        return {"error" : "user can't play with themself"}
    game.player_b = user.id
    game.status = Game.Status.ongoing
    game.save()
    user.games_played.add(game)
    user.status = Tuser.status.playing
    user.save()
    return ({"success" : "game starting"})

@api.post("/abort_game", auth=AJWTAuth())
def abort_game(request, game_id : Form[str]):
    game = Game.objects.filter(token=game_id).first()
    if (not game):
        return {"error" : "No game is found under that game id"}
    game.delete()
    return {"success" : "Game aborted"}


@api.post("/register_game", auth=AJWTAuth())
def register_game(request, id_a : Form[str], id_b : Form[str]):
    if (id_a == id_b):
        return {"error" : "User can't play with themself"}
    user_a = Tuser.objects.filter(id=id_a).first()
    user_b = Tuser.objects.filter(id=id_b).first()
    if (user_a.status == Tuser.status.playing or user_b.status == Tuser.status.playing):
        return {"error" : "A user is playing, can't register match"}
    if (not user_a or not user_b):
        return {"error" : "User not found"}
    game = Game(player_a=user_a.id, player_b=user_b.id, status=Game.Status.ongoing)
    game.save()
    user_a.games_played.add(game);
    user_b.games_played.add(game);
    user_a.status = Tuser.status.playing
    user_b.status = Tuser.status.playing
    user_a.save()
    user_b.save()
    return {"success" : f"{game.id}"}

@api.post("/register_goal", auth=AJWTAuth())
def register_goal(request, game_id : Form[str], scorer_id : Form[int]):
    game = Game.objects.filter(token=game_id).first()
    if (not game):
        return ({"error" : "game not found"})
    if (game.status == Game.Status.done):
        return ({"error" : "game is already done"})
    if (scorer_id == game.player_a or scorer_id == game.player_b):
        if (scorer_id == game.player_a):
            game.players_a_score += 1
        else :
            game.players_b_score += 1
        game.save()
        return ({"success" : "score is registred"})
    return ({"error" : "player not found"})

@api.get("/game_infos", auth=TJWTAuth())
def game_infos(request, gid : str):
	game = Game.objects.filter(token=gid).first()
	if (not game):
		return ({"error" : "game not found"})
	game_status = "done"
	if game.status == Game.Status.ongoing :
		game_status = "ongoing"
	elif game.status == Game.Status.waiting:
		game_status = "waiting"
	return { "fplayer" : game.player_a,
        "splayer" : game.player_b,
        "fplayer_score" : game.players_a_score,
        "splayer_score" : game.players_b_score,
        "game_status" : game_status,
        "date" : game.date
        }
    

@api.post("/register_results", auth=AJWTAuth())
def register_results(request, gid : Form[str]):
    game = Game.objects.filter(token=gid).first()
    fplayer = Tuser.objects.filter(id=game.player_a).first()
    splayer = Tuser.objects.filter(id=game.player_b).first()
    if (not game):
        return ({"error" : "game not found"})
    game.status = Game.Status.done
    # calculating the score
    fplayer.score += game.players_a_score * (0.2 if game.players_a_score > game.players_b_score else 0.1)
    splayer.score += game.players_b_score * (0.2 if game.players_b_score > game.players_a_score else 0.1)
    fplayer.status = Tuser.status.afk
    splayer.status = Tuser.status.afk
    fplayer.save()
    splayer.save()
    game.save();
    return {"success" : "game is over"}

@api.get("/match_history", auth=TJWTAuth())
def match_history(request, id : int):
    user_x = Tuser.objects.filter(username=request.auth).first()
    results = []
    for match in user_x.games_played.all():
        game_status = "done"
        if match.status == Game.Status.ongoing :
            game_status = "ongoing"
        elif match.status == Game.Status.waiting:
             game_status = "waiting"
        user_a = Tuser.objects.filter(id=match.player_a).first()
        user_b = Tuser.objects.filter(id=match.player_b).first()
        result = {
                "user_a" : {
                    "username" : user_a.username,
                    "image" : user_a.image,
                    "score" : match.players_a_score,
                    "status": "Winner" if match.players_a_score > match.players_b_score else "Loser"
                    },
                "user_b" : {
                    "username" : user_b.username,
                    "image" : user_b.image,
                    "score" : match.players_b_score,
                    "status": "Winner" if match.players_b_score > match.players_a_score else "Loser"
                    },
                "game" : {
                    "status" : game_status,
                    "date" : match.date
                    }
                }
        results.append(result)
    return (results)


@api.get("/leaderboard", auth=TJWTAuth())
def leaderboard(request):
    leaderboard = []
    users = list(Tuser.objects.all())
    users.sort()
    for user in users:
        leaderboard.append({"id" : user.id, "username" : user.username, "img" : user.image, "score": user.score})
    leaderboard.reverse()
    return ({"success" : leaderboard})


@api.get("/fleaderboard", auth=TJWTAuth())
def leaderboard(request):
    user = Tuser.objects.filter(username=request.auth).first()
    friends = list(user.friends.all())
    leaderboard = []
    friends.append(user)
    friends.sort()
    for user in friends:
        leaderboard.append({"id" : user.id, "username" : user.username, "img" : user.image, "score": user.score})
    leaderboard.reverse()
    return ({"success" : leaderboard})


