from django.contrib import admin
from django.urls import path
from ninja_jwt.controller import NinjaJWTDefaultController
from rest_api.api import api


urlpatterns = [
    path("api/", api.urls)
]
