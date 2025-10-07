from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViews

router = DefaultRouter()
router.register('', ExpenseViews, basename='expense')  # ✅ No parentheses

urlpatterns = [
  path('', include(router.urls))
]