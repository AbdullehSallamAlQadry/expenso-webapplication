from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
import json
from .serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt 
def Login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body) 

        username = data.get('username')
        password = data.get('password')
        user = User.objects.filter(username=username, password=password).first()
        if user is not None:
            serializer = UserSerializer(user, context={'request': request})
            return JsonResponse({'status': 'success', 'message': 'Welcome back!', 'user': serializer.data}, status=200)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid username or password'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@csrf_exempt 
def Signup_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'message': 'Username already exists'}, status=400)

        user = User.objects.create(username=username, password=password)
        serializer = UserSerializer(user, context={'request': request})
        return JsonResponse({'status': 'success', 'message': 'User created successfully', 'user': serializer.data}, status=201)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)
