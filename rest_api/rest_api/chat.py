from rest_api.api import api
from rest_api.jwt import TJWTAuth, AJWTAuth
from rest_api.models import Tuser, Conversation, Message
from ninja import Form

# takes user a id and user b id
@api.post("/create_conv", auth=TJWTAuth())
def create_conv(request, user : Form[str]):
    user_a = Tuser.objects.filter(username=request.auth).first()
    user_b = Tuser.objects.filter(username=user).first()
    if (not user_b):
        return ({"error" : "User doesn't exist"})
    for blocked in list(user_a.blocked.all()):
        if (blocked.id == user_b.id):
            return {"error" : "the user is blocked"}
    # checking if the user is a friend 
    if not [x for x in user_a.friends.all() if x.id == user_b.id] : 
        return ({"error" : "users are not friends"})

    if Conversation.objects.filter(user_a=user_a.id, user_b=user_b.id).first() or Conversation.objects.filter(user_a=user_b.id, user_b=user_a.id ).first() :
            return {"success" : "Conversation already created"}
    convo = Conversation.objects.create()
    convo.user_a = user_a.id;
    convo.user_b = user_b.id;
    convo.save()
    user_a.conversations.add(convo)
    user_b.conversations.add(convo)
    user_a.save()
    user_b.save()
    return ({"success" : f"conversation created", "conv_id" : convo.id})

@api.get("/convos", auth=TJWTAuth())
def convos(request):
    user = Tuser.objects.filter(username=request.auth).first()
    if (not user):
        return {"error" : "User doesn't exist"}
    convos = []
    for conv in user.conversations.all():
        if (conv.user_a != user.id):
            userb = Tuser.objects.filter(id=conv.user_a).first()
            last_message = conv.messages.all().last()
            print("is ONLINE : ", userb.uonline)
            convos.append({
                "user" : conv.user_a,
                "fullname" : userb.fname + " " + userb.lname,
                "profileImage" : userb.image,
                "username" : userb.username,
                "conv_id" : conv.id,
                'online' : "online" if userb.uonline == 1 else "offline",
                "last_message" : last_message.message if last_message else "",
                "date" : last_message.date if last_message else ""
            })
        else :
            userb = Tuser.objects.filter(id=conv.user_b).first()
            last_message = conv.messages.all().last()
            print("is ONLINE : ", userb.uonline)
            convos.append({
                "user" : conv.user_b,
                "fullname" : userb.fname + " " + userb.lname,
                "profileImage" : userb.image,
                "username" : userb.username,
                'online' : "online" if userb.uonline == 1 else "offline",
                "conv_id" : conv.id,
                "last_message" : last_message.message if last_message else "",
                "date" : last_message.date if last_message else ""
            })
    return ({"success" : convos})


@api.get("/messages", auth=TJWTAuth())
def messages(request, conv_id: int):
    user = Tuser.objects.filter(username=request.auth).first()
    if (not user):
        return {"error" : "User doesn't exist"}
    convo = Conversation.objects.filter(id=conv_id).first()
    if (not convo):
        return {"error" : "Conversation doesn't exist"}
    if (convo.user_a != user.id and convo.user_b != user.id):
        return {"error" : "Nop you can't see this conversation"}
    messages = []
    for message in convo.messages.all():
        messages.append({"sender_id" : message.sender,
                         "message" : message.message,
                         "date" : message.date})
    return {"success" : messages}

@api.post("/register_message", auth=AJWTAuth())
def register_message(request, conv_id: Form[int], message: Form[str], sender : Form[int]):
    conv = Conversation.objects.filter(id=conv_id).first()
    if (not conv):
        return ({"error" : "Conversation doesn't exist"})
    mess = Message(message=message, sender=sender)
    mess.save()
    conv.messages.add(mess)
    conv.save()
    return ({"success" : "message added"})

@api.post("/block", auth=TJWTAuth())
def block(request, user_id: Form[int]):
    user = Tuser.objects.filter(username=request.auth).first()
    blocked = Tuser.objects.filter(id=user_id).first()
    if (not blocked):
        return ({"error" : "Can't find the user"})
    # well checking if they already blocked each other
    for b in list(user.blocked.all()):
        if (b.id == blocked.id):
            return ({"success" : "user already blocked"})
    for conv in list(user.conversations.all()):
        if (conv.user_a == blocked.id or conv.user_b == blocked.id ):
            conv.delete()
    user.blocked.add(blocked)
    blocked.blocked.add(user)
    user.save()
    blocked.save()
    return ({"success" : "user is blocked"})
    

