from django.urls import path
from .views import ShowAllStudents, ShowApproveNewStudents, ApproveNewStudentsRequest,\
                    UpdateStudentDetails, RejectNewStudentsRequest, DeleteStudentsRequest,\
                    FeedbackDashboardPage


urlpatterns = [

    path('show-all-student', ShowAllStudents.as_view()),
    path('show-to-approve-new-student', ShowApproveNewStudents.as_view()),
    path('approve-new-student-request', ApproveNewStudentsRequest.as_view()),
    path('reject-new-student-request', RejectNewStudentsRequest.as_view()),
    path('update-student-details', UpdateStudentDetails.as_view()),
    path('delete-student', DeleteStudentsRequest.as_view()),
    path('feedback-dashboard-page', FeedbackDashboardPage.as_view()),

    # path('display-approve-student', display_student_to_approve, name='display-approve-student'),
    # path('approve-student-request/<str:pk>', views.approve_new_student_request, name='approve-student-request'),
    # path('search-student', views.search_student, name='search-student'),
    # path('delete-student/<str:pk>', views.delete_student, name='delete-student'),
    # path('login-student/<str:pk>', views.login_student, name='login-student'),
    # path('all-classes', views.all_classes, name='all-classes'),
    # path('create-class', views.create_class, name='create-class'),
    # path('get-student-profile/<str:pk>', views.get_student_profile, name='get-student-profile'),

    # path('test-url', views.test_url, name='test-url'),

]
