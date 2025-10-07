from django.urls import path
from . import views

urlpatterns = [
  path("login/", views.Login_view, name="login"),
  path("signup/", views.Signup_view, name="signup"),
]
