from django.urls import re_path
from . import consumers 

websocket_urlpatterns = [
    re_path(r'webs/game/(?P<game_id>\w+)/(?P<username>\w+)/(?P<userid>\w+)/$', consumers.GameConsumer.as_asgi()),
]