from user import *
from game import abort_game, register_game, register_goal, game_infos, register_results, match_history, leaderboard, create_game, register_togame
from friends import add_friend, accept_inv, friend_invs, friends
from chat import create_conv, convos, messages, register_message, block
from tournament import create_tournament, register_to_tournament, tournament_invite, set_alias, tournament_infos, start_tournament, next_round
import time
from colorama import Fore, Style
import sys

class log:
    def success(msg):
        print(f"[{Fore.GREEN}+{Style.RESET_ALL}] - {msg}")
    def error(msg):
        print(f"[{Fore.RED}+{Style.RESET_ALL}] - {msg}")
    def info(msg):
        print(f"[{Fore.BLUE}+{Style.RESET_ALL}] - {msg}")

def registration_test():
    log.success("starting registration tests")
    same_name = genrandstr(10)
    token = register(same_name)["token"]
    log.info("registring an account with the same username")
    try :
        register(same_name)["error"]
        log.success("test passed")
    except : 
        log.error("Test failed")
    email = genrandstr(7)+ "@lmongol.lol"
    token = register(genrandstr(7),  email)["token"]
    log.info("registring an account with the same email")
    try : 
        print(register(genrandstr(7), email)["error"])
        log.success("test passed")
    except : 
        log.error("Test failed")
    log.info("registring a fucked email")
    try :
        token = register(genrandstr(7), "tbonmoklmongol.lol@")["error"]
    except : 
        log.error("Test failed")
    log.success("all tests passed")

def general_user():
    log.info("testing /self")
    tok = register(genrandstr(7))["token"]
    print(selfx(tok))
    log.info("lookup by id")
    print(id(1, tok))
    username = id(1, tok)["username"]
    log.info("lookup by username")
    print(user(username, tok))
    
def update_test():
    log.info("testing fucking update")
    tok = register(genrandstr(7))["token"]
    log.info("testing")
    old_img = selfx(tok)["img"]
    update(img="portished.jpg", token=tok, opass=DEFPASS)
    if (old_img == selfx(tok)["img"]):
        log.error("img isn't changed")
    else :
        log.success("img is changed")
    log.info("trying to change anything with a wrong passwd or no passwd")
    try :
        update(img="portished.jpg", token=tok)["error"]
        log.success("without password working")
        update(img="portished.jpg", token=tok, opass="tbonmok")["error"]
        log.success("wrong password working")
    except:
        log.error("Without password not working")
    log.info("changing the email")
    try : 
        update(email="tbonmok", token=tok, opass=DEFPASS)["error"]
        log.success("wrong email working")
        log.info("now trying to get anything working after changing the email")
        update(email=genrandstr(7) + "@lmongol.lol", token=tok, opass=DEFPASS)
        selfx(tok)["error"]         # excepting an error of user not verified
        log.info("trying to use someone username")
        tok = register(genrandstr(7))["token"]
        print(update(user=API_ADMIN, token=tok, opass=DEFPASS))
        selfx(tok)["error"]
    except:
        log.error("email failed")
        
    log.success("all tests passed")

def logout_test():
    log.info("testing the refresh token")
    toks = register(genrandstr(10))
    print(selfx(toks["token"]))
    time.sleep(65)
    headers = {"Authorization" : f"Bearer {toks['token']}"}
    r = requests.get(BASE_URL + '/self', headers=headers, cookies={"refresh_token" : toks["rtoken"]})
    try : 
        json.loads(r.text)["token"]
        log.success("refresh token khdaaaaaaaaaam")
    except : 
        log.error("refresh token isn't working")
    log.info("testing the logout")
    log.info("letting the access token expire")
    logout(toks["token"], toks["rtoken"])
    time.sleep(65)
    r = requests.get(BASE_URL + '/self', headers={"Authorization" : f"Bearer {toks['token']}"},
                     cookies={"refresh_token" : toks["rtoken"]})
    print(r.text)
    try : 
        json.loads(r.text)["error"]
        log.success("logout khdaaaaaaaaaama")
    except : 
        log.error("logout isn't working")

def game_simulation():
    log.info("creating a game")
    user_a = register(genrandstr(10))["token"]
    user_b = register(genrandstr(10))["token"]
    admin = login(API_ADMIN, API_PASS)["token"]
    useraid = selfx(user_a)["id"]
    userbid = selfx(user_b)["id"]
    log.info(f"usera {useraid} userb {userbid}")
    try :
        log.info("trying to register a game with a normal account")
        register_game(user_a, useraid, userbid)["error"]
        log.success("user can't create a game")
    except:
        log.error("user just created a game")
    game_id = register_game(admin, useraid, userbid)["success"]
    log.info("game created, scoring some goals")
    log.info("player_a will be scoring 3")
    register_goal(admin, game_id, useraid)
    register_goal(admin, game_id, useraid)
    register_goal(admin, game_id, useraid)
    log.info("player b scores only 2")
    register_goal(admin, game_id, userbid)
    register_goal(admin, game_id, userbid)
    log.info("game is so done, let's check it out")
    print(game_infos(user_a, game_id))
    log.info("closing down the game")
    register_results(admin, game_id)
    print(game_infos(user_a, game_id))
    log.info("trying to add after the game ended")
    try : 
        register_goal(admin, game_id, userbid)["error"]
        log.success("doors are sealed")
    except:
        log.error("fucking hell, just close the game already")
    log.info("seeing match history")
    print(match_history(user_a, useraid))
    log.info("checking the score?")
    print(f'user a {selfx(user_a)["score"]}')
    print(f'user b {selfx(user_b)["score"]}')
    log.info("now checking out the leaderboard")
    print(leaderboard(user_a))

def friends_test():
    usera = register(genrandstr(10))["token"]
    userb = register(genrandstr(10))["token"]
    print(friends(usera))
    try : 
        log.info("user b sending invitation to user b")
        add_friend(userb,selfx(usera)["username"])["success"]
        log.success("invitation can be sent")

        log.info("sending invitation to an account that doesn't exist")
        add_friend(userb, "anyways")["error"]
        log.success("doesnt exist working")

        log.info("resending the invitation")
        if "pending" not in add_friend(userb,selfx(usera)["username"])["success"]:
            raise Exception("not pending")

        log.info("listing invitations for user a")
        x = friend_invs(usera)["success"][0]
        print(x)
        
        log.info("accepting the friendship")
        log.success(accept_inv(usera, x["inviter"])["success"])
        log.info("reaccepting the request")
        log.success(accept_inv(usera, x["inviter"])["success"])
        log.info("accepting a non existing request")
        log.success(accept_inv(usera, API_ADMIN)["error"])
        # log.success(f"friends list : {friends(userb)["success"]}  {friends(usera)["success"]}")
        # log.info(f"invitation list {friend_invs(usera)["success"]} must be empty")
    except : 
        log.error("friendship test failed")

def chat_test():
    log.info("creating a conversation")
    usera = register(genrandstr(10))["token"]
    userb = register(genrandstr(10))["token"]
    admin = login(API_ADMIN, API_PASS)["token"]
    try : 
        log.info("trying to message someone who isn't from our friends list")
        log.success(create_conv(usera, selfx(userb)["id"])["error"])
        log.info("befreinding each other")
        add_friend(userb,selfx(usera)["username"])["success"]
        x = friend_invs(usera)["success"][0]
        log.success(accept_inv(usera, x["inviter"])["success"])
        log.info("now they are friends")
        convid = create_conv(usera, selfx(userb)["id"])["conv_id"]
        log.info("checking out the conversation")
        log.success(convos(usera))
        log.success(convos(userb))
        log.info("registering a message between these two users")
        register_message(admin, convid, "layn3l tbon mok hh", selfx(usera)["id"])["success"]
        register_message(admin, convid, "layn3l tbon mok tanta hh", selfx(userb)["id"])["success"]
        register_message(admin, convid, "bad trip asat safe tmr", selfx(usera)["id"])["success"]
        log.info("checking out the messages")
        print(messages(usera, convid)['success'])
    except:
        log.info("cant talk lol")
    
def tournament_test():
    users = []
    for i in range(16):
        users.append(register(genrandstr(10))["token"])
    try:
        log.info("registering a tournament, user 0 is the admin")
        log.success(create_tournament(users[0], "lmongolix lhorpix"))
        log.info("recreating the tournament while still playing on the other one")
        log.success(create_tournament(users[0], "lmongolix lhorpix"))
        invite = tournament_invite(users[0])["success"]
        log.info("other users registering the tournaments")
        for user in users:
            register_to_tournament(user, invite)["success"]
            set_alias(user, genrandstr(10))["success"]
        log.info("now we try to set two similar aliases")
        set_alias(users[2], "t9lwin")
        set_alias(users[3], "t9lwin")["error"]
        log.info("some user tries to start the tournament")
        start_tournament(users[2])["error"]
        log.info("now the admin is starting the tournament")
        start_tournament(users[0])["success"]
        log.info("the games started, let the goals in")
        admin = login(API_ADMIN, API_PASS)["token"]
        for i in range(4):
            rounds = tournament_infos(users[0], invite)["rounds"][-1]["round"]
            for round in rounds:
                # we finish the games here 
                log.info(f"game {round['game_id']}")
                for goal in range(random.randint(0, 5)):
                    register_goal(admin, round['game_id'], round['fplayer'])
                for goal in range(random.randint(0, 5)):
                    register_goal(admin, round['game_id'], round['splayer'])
                register_results(admin, round['game_id'])
            log.info("proceeding to the next round")
            next_round(users[0], invite)
            roundsx = tournament_infos(users[0], invite)
            print(roundsx["rounds"][-1]["round"])
        # log.success(f'tournament winner : {tournament_infos(users[0], invite)["winner"]["user_id"]}')
        # log.success(f"tournament status : {tournament_infos(users[0], invite)["status"]}")
    except :
        log.error("yeah you dumb fuck, recode the fucking tournament code")

def game_supl():
    # log.info("basically two users creating a game and playing without intervention of an admin")
    # usera = register(genrandstr(10))["token"]
    # userb = register(genrandstr(10))["token"]
    # log.info("usera creating a game")
    # game_id = create_game(usera)
    # print(game_id)
    # log.info("usera attempting to create another game")
    # print(create_game(usera))
    # log.info("now userb joinging in")
    # print(register_togame(userb, game_id["success"]))
    # log.info("now another user wanna join that game")
    # userc = register(genrandstr(10))["token"]
    # print(register_togame(userc, game_id["success"]))
    users = []
    for i in range(10):
        x = genrandstr(10)
        print(f"username {x}")
        register(x, passw=x)

def online_test():
    usera = register(genrandstr(10))["token"]
    log.info("setting the user as online")
    print(selfx(usera)["status"])
    online(usera, "true")
    print(selfx(usera)["status"])
    online(usera, "false")
    print(selfx(usera)["status"])


def supl_tests():
    b = register(genrandstr(10))["token"]
    # add_friend(b, selfx(a)["username"])["success"]
    # x = friend_invs(a)["success"][0]
    # accept_inv(a, x["inviter"])["success"]
    # print(create_conv(b, selfx(a)["username"]))
    for i in range(10):
        x= genrandstr(10)
        register(x, passw=x)
        print(f"username {x}")
    


def main():
    if (sys.argv[1].lower() == "supl"):
        supl_tests()
    if (sys.argv[1].lower() == "all" or sys.argv[1].lower() == "user"):
        registration_test()
        general_user()
        update_test()
        logout_test()
        online_test()
    if (sys.argv[1].lower() == "all" or sys.argv[1].lower() == "ugame"):
        game_supl()
    if (sys.argv[1].lower() == "all" or sys.argv[1].lower() == "game"):
        game_simulation()
    if (sys.argv[1].lower() == "all" or sys.argv[1].lower() == "fweins"):
        friends_test()
    if (sys.argv[1].lower() == "all" or sys.argv[1].lower() == "tournament"):
        tournament_test()
    if (sys.argv[1].lower() == "all" or sys.argv[1].lower() == "chat"):
        chat_test()

main()
