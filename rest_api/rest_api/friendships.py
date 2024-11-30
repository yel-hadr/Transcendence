from rest_api.api import api
from rest_api.tfa import TJWTAuth
from rest_api.models import Tuser, Friendship
from ninja import Form

@api.get("/friends", auth=TJWTAuth())
def friends(request):
    user = Tuser.objects.filter(username=request.auth).first()
    friends = []
    for friend in user.friends.all():
        friendx = {
                "friend_id" : friend.username,
                }
        friends.append(friendx)
    return ({"success" : friends})

@api.get("/friend_invs", auth=TJWTAuth())
def get_invitations(request):
    user = Tuser.objects.filter(username=request.auth).first()
    invitations = []
    for inv in user.friendship_inv.all():
        if (inv.status == Friendship.Status.pending):
            inviter = Tuser.objects.filter(id=inv.inviter_id).first()
            print(inviter)
            invx = {
                    "inviter" : inviter.username,
                    "inviter_id" : inviter.id,
                    "status" : "Pending" if inv.status == Friendship.Status.pending else "Fwends"
                    }
            invitations.append(invx)
    return ({"success" : invitations})

@api.post("/accept_friend", auth=TJWTAuth())
def accept_friend(request, username: Form[str]):
    user = Tuser.objects.filter(username=request.auth).first()
    friend = Tuser.objects.filter(username=username).first()
    if (not friend):
        return {"error" : "User doesn't exist"}
    invitation = user.friendship_inv.filter(inviter_id=friend.id).first()
    if (user.friends.filter(id=friend.id)):
        return {"success" : "User is already a friend"}
    if (not invitation):
        return {"error" : "No such invitations"}
    user.friendship_inv.remove(invitation)
    friend.friendship_inv.remove(invitation)
    user.friends.add(friend)
    friend.friends.add(user)
    user.save()
    friend.save()
    return {"success":"User now is your fwend"}

@api.post("/reject_friend", auth=TJWTAuth())
def reject_friend(request, username: Form[str]):
    user = Tuser.objects.filter(username=request.auth).first()
    friend = Tuser.objects.filter(username=username).first()
    if (not friend):
        return {"error" : "User doesn't exist"}
    invitation = user.friendship_inv.filter(inviter_id=friend.id).first()
    invitation.delete()
    return {"success" : "user rejected"}


@api.post("/add_friend", auth=TJWTAuth())
def add_friend(request, username: Form[str]):
    user = Tuser.objects.filter(username=request.auth).first()
    friend = Tuser.objects.filter(username=username).first()
    if (not friend):
        return {"error" : "User doesn't exist"}
    if (user.id == friend.id):
        return {"error": "User can't befriend themself"}
    if (user.friends.filter(id=friend.id)):
        return {"success" : "User is already a friend"}
    if (user.friendship_inv.filter(invitee_id=user.id) or
        user.friendship_inv.filter(inviter_id=user.id)):
        return {"success" : "Friendship still pending"}
    # now we must append the user
    invitor = Friendship.objects.create()
    invitor.init(user, friend)
    user.friendship_inv.add(invitor)
    friend.friendship_inv.add(invitor)
    user.save()
    friend.save()
    return {"success":"Invitation sent"}
