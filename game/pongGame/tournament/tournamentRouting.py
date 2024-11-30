from django.urls import re_path
from . import consumers 

websocket_urlpatterns = [
    re_path(r'webs/tournament/(?P<TournamentID>\w+)/(?P<Username>\w+)/(?P<UserID>\w+)/$', consumers.TournamentConsumer.as_asgi()),
]