from Admin.models import AllUserDetails, BatchDetails
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializer import AllFacultySerializer, FacultyUsernameSerializer, ShowMyBatchesSerializer
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from .constants import FacultyStatus


# Create your views here.

class ShowAllFaculty(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                all_faculty = AllUserDetails.objects.filter(is_deleted=False, user_type='faculty')
                return Response(AllFacultySerializer(all_faculty, many=True).data)
            return HttpResponse("Request has no authorized identity", status=status.HTTP_400_BAD_REQUEST)
        return HttpResponse("User not logged in", status=status.HTTP_401_UNAUTHORIZED)


class ShowNewFacultyPendingRequest(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                all_pending_faculty = AllUserDetails.objects.filter(is_deleted=False, is_active=False, user_type='faculty')
                return Response(AllFacultySerializer(all_pending_faculty, many=True).data)
            return HttpResponse("Request has no authorized identity", status=status.HTTP_400_BAD_REQUEST)
        return HttpResponse("User not logged in", status=status.HTTP_401_UNAUTHORIZED)


class ApproveNewFacultyRequest(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                approval_data = request.data.get("approvalData")
                try:
                    user = AllUserDetails.objects.get(username=approval_data['username'])
                except:
                    return HttpResponse("Faculty not found", status=status.HTTP_404_NOT_FOUND)
                approval_data['status'] = FacultyStatus.JOINED
                serialized_data = AllFacultySerializer(user, data=approval_data, partial=True)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Faculty create account request approved successfully", status=status.HTTP_200_OK)
                return HttpResponse(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class UpdateFacultyDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                faculty_data = request.data.get("facultyData")
                try:
                    user = AllUserDetails.objects.get(username=faculty_data['username'])
                except:
                    return JsonResponse("Faculty not found", status=status.HTTP_404_NOT_FOUND)
                serialized_data = AllFacultySerializer(user, data=faculty_data, partial=True)

                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Faculty Details updated successfully", status=status.HTTP_200_OK)
                return HttpResponse(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class ShowFacultyUsername(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                try:
                    all_faculty = AllUserDetails.objects.filter(is_deleted=False, is_active=True, user_type='faculty')
                    return Response(FacultyUsernameSerializer(all_faculty, many=True).data)
                except:
                    return Response("No Faculty Found", status=status.HTTP_400_BAD_REQUEST)
            return Response("Invalid User", status=status.HTTP_403_FORBIDDEN)
        return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class ShowMyBatches(APIView):
    def get(self, request):

        try:
            get_all_my_batches = BatchDetails.objects.get(faculty=request.user.username,
                                                          is_deleted=False, is_active=True)
            return Response(ShowMyBatchesSerializer(get_all_my_batches, many=True).data)
        except:
            return Response("No Faculty Found", status=status.HTTP_400_BAD_REQUEST)



