from django.urls import path
from .views import ShowAllStudents, ShowApproveNewStudents, ApproveNewStudentsRequest, \
    UpdateStudentDetails, RejectNewStudentsRequest, DeleteStudentsRequest, FeedbackDashboardPage

urlpatterns = [

    path('show-all-student', ShowAllStudents.as_view()),
    path('show-to-approve-new-student', ShowApproveNewStudents.as_view()),
    path('approve-new-student-request', ApproveNewStudentsRequest.as_view()),
    path('reject-new-student-request', RejectNewStudentsRequest.as_view()),
    path('update-student-details', UpdateStudentDetails.as_view()),
    path('delete-student', DeleteStudentsRequest.as_view()),
    path('feedback-dashboard-page', FeedbackDashboardPage.as_view()),


    # path('test-url', views.test_url, name='test-url'),

]
