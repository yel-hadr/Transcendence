"""
ASGI config for pongGame project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from pong import gameRouting
from tournament import tournamentRouting

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pongGame.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            gameRouting.websocket_urlpatterns + tournamentRouting.websocket_urlpatterns
        )
    ),
})

