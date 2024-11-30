from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser

class Friendship(models.Model):
    class Status(models.IntegerChoices):
        pending = 0
        accepted = 1
    status = models.IntegerField(default=Status.pending)
    inviter_id = models.IntegerField(default=0)
    invitee_id = models.IntegerField(default=0)
    def init(self, inviter, invitee, status=Status.pending):
        self.status = status
        self.inviter_id = inviter.id
        self.invitee_id = invitee.id
        self.save()


class Game(models.Model):
    token = models.CharField(max_length=64)
    player_a = models.IntegerField(default=0)
    player_b = models.IntegerField(default=0)
    class Status(models.IntegerChoices):
        waiting = 0
        ongoing = 1
        done = 2
    status = models.IntegerField(default=Status.waiting)
    players_a_score = models.IntegerField(default=0)
    players_b_score = models.IntegerField(default=0)
    date = models.DateField(auto_now_add=True)

class Message(models.Model):
    sender = models.IntegerField()
    message = models.CharField(max_length=2048)
    date = models.DateField(auto_now_add=True)

class Conversation(models.Model):
    user_a = models.IntegerField(default=0)
    user_b = models.IntegerField(default=0)
    messages = models.ManyToManyField(Message)

class Tuser(AbstractUser):
    username = models.CharField(max_length=32, unique=True)
    tmp_otp = models.IntegerField(default=0)
    fname = models.CharField(max_length=64)
    lname = models.CharField(max_length=64)
    email = models.EmailField(max_length=64, unique=True)
    bio = models.CharField(max_length=1024, blank=True)
    verified = models.BooleanField(default=False)
    registeration_date = models.DateField(auto_now_add=True)
    image = models.FilePathField()
    score = models.FloatField(default=0.0)
    password_hash = models.CharField(max_length=256)        # using SHA-256	for now
    friends = models.ManyToManyField("Tuser", blank=True, related_name="blocked+")
    friendship_inv = models.ManyToManyField(Friendship)
    blocked = models.ManyToManyField("Tuser", blank=True, related_name="friends+")
    tfa = models.BooleanField(default=False)
    tfa_locked = models.BooleanField(default=True)
    tfa_otp = models.IntegerField(default=0)
    fp_token = models.CharField(max_length=64)
    games_played = models.ManyToManyField(Game)
    tournament_alias = models.CharField(max_length=32, default="")
    tournament_code = models.CharField(max_length=100, default="")
    conversations = models.ManyToManyField(Conversation)
    class status(models.IntegerChoices):
        afk = 1
        playing = 2
    class ostatus (models.IntegerChoices):
        online = 1
        offline = 2
    uonline = models.IntegerField(default=ostatus.offline)
    game_status = models.IntegerField(default=status.afk)
    def __lt__(self, other):
        return self.score < other.score
    

class Rounds(models.Model):
    games = models.ManyToManyField(Game)
    def status (self):
        game_status = []
        for game in self.games.all():
            game_bit = {
                    "player A" : game.player_a,
                    "player B" : game.player_b,
                    "game status" : "Ongoing" if game.status == Game.Status.ongoing else "Done",
                    "player A score" : game.players_a_score,
                    "player B score" : game.players_b_score,
                    "winner" : "Ongoing" if game.status == Game.Status.ongoing else game.winner,
                    "date" : game.date
                    }
            game_status.append(game_bit)
        return (game_status)

class Tournament(models.Model):
    tournament_code = models.CharField(max_length=100, default="")
    players = models.ManyToManyField(Tuser)
    admin = models.IntegerField()
    rounds = models.ManyToManyField(Rounds)
    class Status(models.IntegerChoices):
        waiting = 0
        ongoing = 1
        done = 2
    status = models.IntegerField(default=Status.ongoing)
    date = models.DateField(auto_now_add=True)

