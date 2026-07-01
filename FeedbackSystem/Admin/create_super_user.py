from rest_framework import status
from rest_framework.views import APIView
from .models import AllUserDetails
from django.http import HttpResponse
from rest_framework.response import Response


class AddSuperUser(APIView):

    def post(self, request):

        username = 'admin@admin.com'
        password = 'admin'

        if AllUserDetails.objects.filter(username=username).exists():
            return HttpResponse("User is already exists", status=status.HTTP_409_CONFLICT)
        # all_user_manager = AllUserManager()
        super_user = AllUserDetails.objects.create_superuser(username=username, password=password)
        print('User Created Successfully: ', super_user)
        return Response({
            "message": "Super User created successfully.",
            "username": username,
        }, status=status.HTTP_201_CREATED)
