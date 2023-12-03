from django.urls import path
from . import views


urlpatterns = [
    path("signup", views.signup),
    path("login", views.login),
    path("logout", views.logout),
    path("delete", views.delete),
    path("validate", views.validate)
]
