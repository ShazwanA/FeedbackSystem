import jwt
from django.contrib.auth import authenticate
from rest_framework.response import Response
import django
import os
import sys
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password
from datetime import date

from .serializer import DepartmentSerializer, SubjectSerializer, BatchSerializer, \
    TestDataSerializer, TestFileSerializer, TestReadDataSerializer, CategorySerializer,\
    UserProfileSerializer, CourseSerializer, FeedbackQuestionSerializer, AllUserNamesSerializer

from distutils.util import strtobool

import io
from django.http import FileResponse
from reportlab.pdfgen import canvas

import pandas as pd
from rest_framework_simplejwt.tokens import RefreshToken

from Faculty.serializer import ShowMyBatchesSerializer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FeedbackSystem.settings')
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from FeedbackSystem import settings
django.setup()
from .models import TestModel, CategoryDetails, AllUserDetails
from .models import DepartmentDetails, SubjectDetails, BatchDetails, CourseDetails, FeedbackQuestionsData
from Student.constants import StudentStatus
from Faculty.constants import FacultyStatus


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class LoginUser(APIView):
    def post(self, request):

        user = AllUserDetails.objects.filter(username=request.data["username"])
        if not user:
            return HttpResponse("User not found", status=status.HTTP_404_NOT_FOUND)
        if not authenticate(request=request, username=request.data["username"],
                            password=request.data['userData']['password'],
                            user_type=request.data['userData']['user_type']):
            return HttpResponse("Incorrect Credentials", status=status.HTTP_401_UNAUTHORIZED)

        token = get_tokens_for_user(user.get())
        access_token = token.get('access')
        refresh_token = token.get('refresh')

        response = Response()
        response.set_cookie(key='access_token', value=access_token, httponly=True)
        response.set_cookie(key='refresh_token', value=refresh_token)

        response.data = {
            'username': user.get().username,
            'user_type': user.get().user_type,
            'STATE': True,
            'access': access_token,
            'refresh': refresh_token
        }
        return response


class AddNewUser(APIView):
    def post(self, request):
        user_data = request.data.get('userData', {})
        username = user_data.get('username')
        password = user_data.get('password')
        user_type = user_data.get('user_type')  # Add other fields as needed
        first_name = user_data.get('first_name')  # Add other fields as needed
        created_by = request.user.username

        required_fields = [username, password, user_type, first_name]
        # 1. Validate required fields
        if not all(required_fields):
            return HttpResponse("Fill all required fields", status=status.HTTP_400_BAD_REQUEST)

        # 2. Check for existing user
        if AllUserDetails.objects.filter(username=username).exists():
            return HttpResponse("User is already exists", status=status.HTTP_409_CONFLICT)

        # 3. Create the user
        new_user = AllUserDetails.objects.create(
            username=username,
            password=make_password(password),  # Hash the password
            user_type=user_type,  # Set other fields as needed
            first_name=first_name,
            created_by=created_by,
            last_name=user_data.get('last_name') if user_data.get('last_name') else None,
            gender=user_data.get('gender') if user_data.get('gender') else None,
            date_of_birth=user_data.get('date_of_birth') if user_data.get('date_of_birth') else None,
            status=StudentStatus.JOINED,
            department_id=user_data.get('department') if user_data.get('department') else None,
            joining_date=user_data.get('joining_date') if user_data.get('joining_date') else None,
            qualification=user_data.get('qualification') if user_data.get('qualification') else None,
            experience=user_data.get('experience') if user_data.get('experience') else None,
            father_name=user_data.get('father_name') if user_data.get('father_name') else None,
            roll_no=user_data.get('roll_no') if user_data.get('roll_no') else None,
            course_id=user_data.get('course') if user_data.get('course') else None,
            is_active=user_data.get('is_active')
        )
        return JsonResponse({
            "message": "User created successfully.",
            "username": new_user.username,
            "user_type": new_user.user_type,
        }, status=status.HTTP_201_CREATED)


class UserProfile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                username = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user = AllUserDetails.objects.filter(username=username['user_id']).first()
                return Response(UserProfileSerializer(user).data)
            return HttpResponse("User Not Found", status=status.HTTP_404_NOT_FOUND)
        return HttpResponse("User not logged in", status=status.HTTP_401_UNAUTHORIZED)


class ChangePassword(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user = AllUserDetails.objects.get(username=request.user.username)
            compare_old_password = check_password(request.data.get('old_password'), user.password)
            if not compare_old_password:
                return Response("Old Password is Invalid", status=status.HTTP_404_NOT_FOUND)

            if user and compare_old_password:
                user.set_password(request.data.get('new_password'))
                user.save()
                return Response("Password Changed Successfully", status=status.HTTP_200_OK)
        except:
            return Response("Password Error", status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordByParent(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            user = AllUserDetails.objects.get(username=request.data.get('user'))
            if user:
                user.password = make_password(request.data.get('new_password'))
                user.save()
                return Response("Password Changed Successfully", status=status.HTTP_200_OK)
            else:
                return Response("User Not Found", status=status.HTTP_404_NOT_FOUND)
        except:
            return Response("Password Error", status=status.HTTP_400_BAD_REQUEST)


class ShowAllUsernames(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                try:
                    all_users = ''
                    if request.user.user_type == 'faculty':
                        all_users = AllUserDetails.objects.filter(is_deleted=False, is_active=True, user_type='student')\
                                                                 .exclude(username=request.user.username)
                    elif request.user.user_type == 'admin':
                        all_users = AllUserDetails.objects.filter(is_deleted=False, is_active=True) \
                                                                .exclude(username=request.user.username)
                    return Response(AllUserNamesSerializer(all_users, many=True).data)
                except:
                    return Response("No Users Found", status=status.HTTP_400_BAD_REQUEST)
            return Response("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)



class Logout(APIView):
    def get(self, request):
        response = Response()
        response.delete_cookie(key='refresh_token', samesite=None)
        response.delete_cookie(key='access_token', samesite=None)

        response.data = {
            'msg': "Logged out"
        }
        return response


class ShowAllCourses(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request):
        # if request.headers.get('Authorization'):
        #     token = request.auth.token
        #     if token:
        try:
            if bool(strtobool(request.GET.get('is_active', 'false'))) is True:
                all_active_courses = CourseDetails.objects.filter(is_deleted=False, is_active=True)
            else:
                all_active_courses = CourseDetails.objects.filter(is_deleted=False)
            return Response(CourseSerializer(all_active_courses, many=True).data)
        except:
            return HttpResponse("Request has no authorized identity", status=status.HTTP_400_BAD_REQUEST)


class AddNewCourse(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                check_exist = CourseDetails.objects.filter(course_code=request.data.get('course_code'))
                if check_exist:
                    return HttpResponse("Record already exist", status=status.HTTP_400_BAD_REQUEST)
                serialized_data = CourseSerializer(data=request.data)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Course added successfully")
                return HttpResponse("Course Data is not valid", status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_401_UNAUTHORIZED)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class UpdateCourse(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                course_code = request.data.get("course_code")
                try:
                    course = CourseDetails.objects.get(course_code=course_code)
                except:
                    return JsonResponse("Course not found", status=status.HTTP_404_NOT_FOUND)
                serialized_data = CourseSerializer(course, data=request.data, partial=True)

                if serialized_data.is_valid():
                    serialized_data.save()
                    return JsonResponse("Course Details updated successfully", safe=False, status=status.HTTP_200_OK)
                return HttpResponse(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class ShowAllDepartments(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request):
        # if request.headers.get('Authorization'):
        #     token = request.auth.token
        #     if token:
        try:
            if bool(strtobool(request.GET.get('is_active', 'false'))) is True:
                all_active_departments = DepartmentDetails.objects.filter(is_deleted=False, is_active=True)
            else:
                all_active_departments = DepartmentDetails.objects.filter(is_deleted=False)
            return Response(DepartmentSerializer(all_active_departments, many=True).data)
        except:
            return HttpResponse("Request has no authorized identity", status=status.HTTP_400_BAD_REQUEST)


class AddNewDepartment(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                check_exist = DepartmentDetails.objects.filter(department_code=request.data.get("department_code"))
                if check_exist:
                    return HttpResponse("Record already exist", status=status.HTTP_400_BAD_REQUEST)
                serialized_data = DepartmentSerializer(data=request.data)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return JsonResponse("Department added successfully", safe=False)
                return JsonResponse("Department Data is not valid", safe=False)
            return HttpResponse("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return HttpResponse("Something Went Wrong")


class UpdateDepartment(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                department_code = request.data.get("department_code")
                try:
                    department = DepartmentDetails.objects.get(department_code=department_code)
                except:
                    return JsonResponse("Department not found", status=status.HTTP_404_NOT_FOUND)
                serialized_data = DepartmentSerializer(department, data=request.data, partial=True)

                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Department Details updated successfully", status=status.HTTP_200_OK)
                return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class ShowAllSubjects(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                if bool(strtobool(request.GET.get('is_active', 'false'))) is True:
                    all_active_subjects = SubjectDetails.objects.filter(is_deleted=False, is_active=True)
                else:
                    all_active_subjects = SubjectDetails.objects.filter(is_deleted=False)
                return Response(SubjectSerializer(all_active_subjects, many=True).data)
            return Response("Invalid User", status=status.HTTP_400_BAD_REQUEST)
        return Response("User not logged in", status=status.HTTP_401_UNAUTHORIZED)


class AddNewSubject(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                check_exist = SubjectDetails.objects.filter(subject_code=request.data.get("subject_code"))
                if check_exist:
                    return HttpResponse("Record already exist", status=status.HTTP_400_BAD_REQUEST)
                serialized_data = SubjectSerializer(data=request.data)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Subject added successfully", status=status.HTTP_200_OK)
                return HttpResponse("Subject Data is Not Valid", status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_401_UNAUTHORIZED)
        return HttpResponse("Something Went Wrong", status=status.HTTP_405_METHOD_NOT_ALLOWED)


class UpdateSubject(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                subject_code = request.data.get("subject_code")
                try:
                    subject = SubjectDetails.objects.get(subject_code=subject_code)
                except:
                    return Response("Subject not found", status=status.HTTP_404_NOT_FOUND)
                serialized_data = SubjectSerializer(subject, data=request.data, partial=True)

                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Subject Details updated successfully", status=status.HTTP_200_OK)
                return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class ShowAllCategories(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                if bool(strtobool(request.GET.get('is_active', 'false'))) is True:
                    all_active_category = CategoryDetails.objects.filter(is_deleted=False, is_active=True)
                else:
                    all_active_category = CategoryDetails.objects.filter(is_deleted=False)
                # all_active_categories = CategoryDetails.objects.filter(is_deleted=False)
                return Response(CategorySerializer(all_active_category, many=True).data)
            return HttpResponse("Request has no authorized identity", status=status.HTTP_400_BAD_REQUEST)
        return HttpResponse("User not logged in", status=status.HTTP_401_UNAUTHORIZED)


class AddNewCategory(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                check_exist = CategoryDetails.objects.filter(category_code=request.data.get('category_code'))
                if check_exist:
                    return HttpResponse("Category already exist")
                serialized_data = CategorySerializer(data=request.data)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return JsonResponse("Category added successfully", status=status.HTTP_200_OK)
                return HttpResponse("Category Data is not valid", status=status.HTTP_400_BAD_REQUEST)
            return HttpResponse("User Not Logged In", status=status.HTTP_401_UNAUTHORIZED)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class UpdateCategory(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                category_code = request.data.get("category_code")
                try:
                    category = CategoryDetails.objects.get(category_code=category_code)
                except:
                    return JsonResponse("Category not found", status=status.HTTP_404_NOT_FOUND)
                serialized_data = CategorySerializer(category, data=request.data, partial=True)

                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Category Details updated successfully", status=status.HTTP_200_OK)
                return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response("User Not Logged In", status=status.HTTP_403_FORBIDDEN)
        return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class ShowAllBatches(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # if request.headers.get('Authorization'):
        #     token = request.auth.token
        try:
            if request.user.user_type != 'faculty':
                all_active_batches = BatchDetails.objects.filter(is_deleted=False)
                return Response(BatchSerializer(all_active_batches, many=True).data)
            else:
                my_batches = BatchDetails.objects.filter(faculty=request.user.username,
                                                         is_deleted=False, is_active=True)
                return Response(ShowMyBatchesSerializer(my_batches, many=True).data)
        except:
            Response("Permission Denied", status=status.HTTP_401_UNAUTHORIZED)
        return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class AssignNewBatch(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.headers.get('Authorization'):
            token = request.auth.token
            if token:
                check_exist_batch_code = BatchDetails.objects.filter(batch_code=request.data.get('batch_code'))
                if check_exist_batch_code:
                    return Response("This batch code is already exist", status=status.HTTP_400_BAD_REQUEST)
                check_exist = BatchDetails.objects.filter(faculty=request.data.get('faculty'),
                                                          batch_time=request.data.get('batch_time'))
                if check_exist:
                    return Response("Faculty is already has a batch at this time", status=status.HTTP_400_BAD_REQUEST)
                check_exist = BatchDetails.objects.filter(faculty=request.data.get('faculty'),
                                                          batch_time=request.data.get('batch_time'))
                if check_exist:
                    return Response("This department->course->subject is already assigned",
                                    status=status.HTTP_400_BAD_REQUEST)
                serialized_data = BatchSerializer(data=request.data)
                if serialized_data.is_valid():
                    serialized_data.save()
                    return Response("Batch Assigned successfully", status=status.HTTP_201_CREATED)
                return Response("Batch Data is not valid", status=status.HTTP_400_BAD_REQUEST)
            return Response("User Not Logged In", status=status.HTTP_401_UNAUTHORIZED)
        return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class UpdateBatch(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            batch = BatchDetails.objects.get(batch_code=request.data.get('batch_code'))
            serialized_data = BatchSerializer(batch, data=request.data, partial=True)
            if serialized_data.is_valid():
                serialized_data.save()
                return Response("Batch Updated Successfully", status=status.HTTP_200_OK)
            return Response("Batch Data Invalid", status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response("Batch Not Found", status=status.HTTP_404_NOT_FOUND)


class DeleteBatch(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            batch = BatchDetails.objects.get(batch_code=request.data.get('batchCode'))
            if batch:
                batch.delete()
                batch.deactivate()
                batch.save()
                return Response("Batch Deleted Successfully", status=status.HTTP_404_NOT_FOUND)
        except:
            return Response("Batch Not Found", status=status.HTTP_404_NOT_FOUND)


class AddFeedbackQuestion(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            request.data['question_added_on'] = date.today()
            serialized_data = FeedbackQuestionSerializer(data=request.data)
            if serialized_data.is_valid():
                serialized_data.save()
                return Response("Question added successfully")
        except:
            return HttpResponse("Question Data is not valid", status=status.HTTP_400_BAD_REQUEST)
        return HttpResponse("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class ShowAllFeedbackQuestions(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # if request.headers.get('Authorization'):
        #     token = request.auth.token
        #     if token:
        try:
            all_questions = None
            if request.user.user_type == 'admin':
                all_questions = FeedbackQuestionsData.objects.filter(is_deleted=False)
            elif request.user.user_type == 'faculty':
                all_questions = FeedbackQuestionsData.objects.filter(is_deleted=False, is_active=True)
            return Response(FeedbackQuestionSerializer(all_questions, many=True).data)
        except:
            return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class UpdateFeedbackQuestion(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            get_question = FeedbackQuestionsData.objects.get(id=request.data.get('id'))
            serialized_data = FeedbackQuestionSerializer(get_question, data=request.data, partial=True)
            if serialized_data.is_valid():
                serialized_data.save()
                return Response("Question Updated Successfully", status=status.HTTP_200_OK)
        except:
            return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


class DeleteFeedbackQuestion(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            get_question = FeedbackQuestionsData.objects.get(id=request.data.get('questionId'))
            get_question.deactivate()
            get_question.delete()
            get_question.save()
            return Response("Question Deleted Successfully", status=status.HTTP_200_OK)
        except:
            return Response("Something Went Wrong", status=status.HTTP_400_BAD_REQUEST)


# Testing Model.....

@csrf_exempt
def test_model(request):
    if request.method == "GET":
        dataFromDB = TestModel.objects.all()
        serializedData = TestReadDataSerializer(dataFromDB, many=True)
        json_data = JSONRenderer().render(serializedData.data)
        return HttpResponse(json_data, content_type="application/json")

    if request.method == "POST":
        request.POST._mutable = True
        request.FILES._mutable = True
        print(request.FILES["dataFile"])
        # file = JSONParser().parse(request)
        file = request.FILES["dataFile"]
        filedata = pd.read_excel(file)
        row_count = len(filedata)
        print("Rows  -->>  ", request.FILES)
        for i in range(row_count):
            # request.POST["username"] = filedata["employee_name"][i]
            # request.POST["password"] = filedata["employee_id"][i]
            # print(filedata.head(1))
            # arr = filedata["employee_name"]
            # print(arr)
            # print("Files --->>>  ", request.FILES)
            # parsedNewData = JSONParser().parse(request)
            # serializedData = TestSerializer(data = parsedNewData)
            # print("Parsed -- > ",serializedData)
            # if serializedData.is_valid():
            #     serializedData.save()
            #     print(serializedData)
            #     return JsonResponse("Image uploaded successfully", safe=False)
            # FileSerializer = TestFileSerializer(data=request.FILES)
            user = {"username": filedata["employee_name"][i]}
            DataSerializer = TestDataSerializer(data=user)
            # serial = {"data": DataSerializer.data, "file":FileSerializer.data}

            if DataSerializer.is_valid():
                # DataSerializer.dataFile = request.FILES["dataFile"]
                DataSerializer.save()

                buffer = io.BytesIO()

                # Create the PDF object, using the buffer as its "file."
                p = canvas.Canvas(buffer)
                data = "Employee Name : " + filedata["employee_name"][i]
                id = "Employee ID : " + filedata["employee_id"][i]
                joining_date = "Joined on : " + str(filedata["joining_date"][i])
                designation = "POST : " + filedata["designation"][i]
                # data = unicode(data, 'latin-1')
                # Draw things on the PDF. Here's where the PDF generation happens.
                # See the ReportLab documentation for the full list of functionality.
                p.drawString(50, 500, data)
                p.drawString(50, 480, id)
                p.drawString(50, 460, designation)
                p.drawString(50, 440, joining_date)

                # Close the PDF object cleanly, and we're done.
                p.showPage()
                # p.save()
                buffer.seek(0)
                # uploaded =
                pdf = FileResponse(buffer, as_attachment=False, filename=filedata["employee_name"][i]+'.pdf').file_to_stream
                # request.FILES["dataFile"] = FileResponse(buffer, as_attachment=False, filename=filedata["employee_name"][i]+'.pdf').file_to_stream
                print("File response -- >>  ",FileResponse(buffer, as_attachment=False, filename=filedata["employee_name"][i]+'.pdf').file_to_stream)
                # print("buffer seek -- >>  ",buffer.seek(0))
                # print(request.FILES)
                # pdf = FileResponse(buffer, as_attachment=True, filename='hello.pdf')
                file_serializer_data = TestFileSerializer(TestModel.objects.get(username=DataSerializer.data.get("username")), data=request.FILES["dataFile"], partial=True)
                if file_serializer_data.is_valid():
                    file_serializer_data.save()
                    # print("Data saved")

        return FileResponse(buffer, as_attachment=True, filename='hello.pdf')
        # return JsonResponse("Success", safe=False)


def delete_test_model(request):
    if request.method == 'GET':
        # info = faculty_details.objects.get(stud_username=pk)
        TestModel.objects.all().delete()
        return JsonResponse("Data deleted successfully", safe=False)
    return JsonResponse("Method is not correct", safe=False)
