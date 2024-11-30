## User management
### [rest_api/user.py]
endpoint : /user/{str:username}     [GET]  
searches for a registred user by username and return back its infos,
in case the user doesn't exist it returns an error.  
note : doesn't return game history

endpoint : /id/{int:id}     [GET]  
does the same job as the previous endpoint just uses the id to filter

endpoint : /update          [POST]  
requires the user to be authenticated and verified  
This endpoint as the name implies it checks the user infos using a regex pattern then updates them  
in case of an error it returns a json error response  

endpoint : /register        [POST]  
registers a user in the database if the infos were correct, also sends an otp to the provided email and returns back a jwt token  
The user must automatically be redirected to a account verification page  

endpoint : /login           [POST]  
logs the user by checking its username and password then returns back a jwt token and a status if the account is locked due to 2fa, if the `locked` parameter is set to true the user must be directed to an otp verfication page  
in case the user wasnt found or the password is incorrect it returns back an error  
the login endpoint takes two form parameters email/username and password  
If the user did enable 2fa the login endpoint sends an otp to its account  

endpoint : /logout           [POST]  
expires the jwt token and locks the account if it's 2fa protected  

endpoint : /verify_otp      [POST]  
used for user's email verification, this must be used to verify a new user  
the endpoint returns an error if the otp is wrong  

## User protection 
### [rest_api/tfa.py]
class : TJWTAuth  
A class that checks if the user's account is verified or unlocked before getting into a protected endpoint  

endpoint : /challenge2fa        [POST]  
Only should be used if the user uses 2fa, after loging in an otp is sent to the user's email this endpoint checks the otp and unlocks the account

endpoint : /enable2fa           [POST]  
enables 2fa in the user's account

## Password assistance
endpoint : /forgot_password     [POST]  
sends a link to the user's email to restore its password  
NOTE: must create an endpoint created /restore_password that uses /restore_password enpoint

endpoint : /check_token         [GET]  
used as a helper to check the token

endpoint : /restore_password    [POST]  
takes two form args, the token and the new password  
basically it search for the user using the token if it exists it changes it's password, if not it returns an error  

endpoint : /delete_account      [POST]  
Yeah, deletes the account, thats about it

## third-party authentication
endpoint : /auth/42             [GET]  
returns the valid authentication link  

endpoint : /callback            [GET]  
registers the user and returns back an access_token

## friendship
endpoint : /add_friend          [POST]  
an endpoint that do a bunch of checks then sends an invitation to a friend  

endpoint : /accept_friend       [POST]  
checks for the pending invitation and accepts it

endpoint : /get_invitations     [GET]  
returns a list of pending invitations to the user 

## Games results
endpoint : /register_game       [POST]  
the endpoint is used only with the admin user set in the env file  
This endpoint must be called once the game is confirmed, it takes the username of the two players

endpoint : /register_result     [POST]  
also this endpoint is used only by the admin  
after playing the match results are stores using this endpoint  
it accepts 4 params, 2 usernames and 2 scores  

endpoint : /match_history       [GET]
returns an array of json representations of a game of the logged user


# TODO  
[X] - set online endpoints
[ ] - tournaments endpoints
[ ] - matchmaking
    [ ] - invitations 
