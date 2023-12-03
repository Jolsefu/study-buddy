from django.urls import path
from . import views


urlpatterns = [
    path("test_token", views.test_token)
]
