import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "FeedbackSystem.settings")

import django
django.setup()

from rest_framework import status
from rest_framework.views import APIView
from Admin.models import AllUserDetails
from django.http import HttpResponse
from rest_framework.response import Response


def create_super_user():
    full_name = 'Administrator'
    username = 'admin@admin.com'
    password = 'admin'
    usertype = 'admin'

    if AllUserDetails.objects.filter(username=username).exists():
        return HttpResponse("User is already exists", status=status.HTTP_409_CONFLICT)
    # all_user_manager = AllUserManager()
    super_user = AllUserDetails.objects.create_superuser(fullname=full_name,
                                                         username=username,
                                                         password=password,
                                                         usertype=usertype)
    return Response({
        "message": "Super User created successfully.",
        "username": username,
        "password": password
    }, status=status.HTTP_201_CREATED)


if __name__ == "__main__":
    user = create_super_user()
    print(user.data['message'])
    print(f"Username: {user.data['username']}")
    print(f"password: {user.data['password']}")
