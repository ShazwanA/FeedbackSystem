from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializer import AllStudentSerializer, FeedbackDashboardPageSerializer
from Admin.models import AllUserDetails, CourseDetails, FeedbackByStudent, BatchDetails
from distutils.util import strtobool
from .constants import StudentStatus
from django.db.models import Q
from datetime import date


class ShowAllStudents(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                if bool(strtobool(request.GET.get('is_active', 'false'))) is True:
                    all_students = AllUserDetails.objects.filter(is_deleted=False, is_active=True, user_type='student')
                else:
                    all_students = AllUserDetails.objects.filter(is_deleted=False, user_type='student')
                return Response(AllStudentSerializer(all_students, many=True).data)
            return HttpResponse("Request has no authorized identity", status=status.HTTP_400_BAD_REQUEST)
        return HttpResponse("User not logged in", status=status.HTTP_401_UNAUTHORIZED)


class ShowApproveNewStudents(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                all_students = AllUserDetails.objects.filter(is_deleted=False, is_active=False, user_type='student')
                return Response(AllStudentSerializer(all_students, many=True).data)
            return HttpResponse("Request has no authorized identity", status=status.HTTP_400_BAD_REQUEST)
        return HttpResponse("User not logged in", status=status.HTTP_401_UNAUTHORIZED)


class ApproveNewStudentsRequest(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                approval_data = request.data.get("approvalData")
                try:
                    user = AllUserDetails.objects.get(username=approval_data['username'])
                except:
                    return HttpResponse("Student not found", status=status.HTTP_404_NOT_FOUND)
                approval_data['status'] = StudentStatus.JOINED
                serialized_data = AllStudentSerializer(user, data=approval_data, partial=True)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Student create account request approved successfully", status=status.HTTP_200_OK)
                return HttpResponse(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class RejectNewStudentsRequest(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                username = request.data.get("username")
                try:
                    user = AllUserDetails.objects.get(username=request.data.get("username"))
                except:
                    return HttpResponse("Student not found", status=status.HTTP_404_NOT_FOUND)
                # approval_data['status'] = StudentStatus.JOINED
                request.data['is_deleted'] = True
                serialized_data = AllStudentSerializer(user, data=request.data, partial=True)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Student Create Account Request Rejected Successfully", status=status.HTTP_200_OK)
                return HttpResponse(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class UpdateStudentDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                student_data = request.data.get("studentData")
                try:
                    user = AllUserDetails.objects.get(username=student_data['username'])
                except:
                    return JsonResponse("Student Not Found", status=status.HTTP_404_NOT_FOUND)
                serialized_data = AllStudentSerializer(user, data=student_data, partial=True)

                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Student Details Updated Successfully", status=status.HTTP_200_OK)
                return JsonResponse(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return JsonResponse("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return JsonResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class DeleteStudentsRequest(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                username = request.data.get("username")
                try:
                    user = AllUserDetails.objects.get(username=username)
                except:
                    return HttpResponse("Student Not Found", status=status.HTTP_404_NOT_FOUND)
                request.data['is_deleted'] = True
                request.data['is_active'] = False
                serialized_data = AllStudentSerializer(user, data=request.data, partial=True)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Student Create Account Request Rejected", status=status.HTTP_200_OK)
                return HttpResponse(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class FeedbackDashboardPage(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            current_year = date.today().year
            check_already_feedback = FeedbackByStudent.objects.filter(student=request.user.user_id,
                                                                      year=current_year, is_deleted=False)
            all_batches = BatchDetails.objects.filter(department=request.user.department.department_code,
                                                      course=request.user.course.course_code, is_active=True,
                                                      is_deleted=False, year=current_year)
            data = FeedbackDashboardPageSerializer(all_batches, many=True).data
            return Response({'batch_data': data, 'already_feedback_data': {}})
        except:
            return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)

