from django.urls import path
from .views import ShowAllFaculty, ShowNewFacultyPendingRequest, ApproveNewFacultyRequest, \
    UpdateFacultyDetails, ShowFacultyUsername, ShowMyBatches

urlpatterns = [
    path('show-all-faculty', ShowAllFaculty.as_view(), name='show-all-faculty'),
    path('show-new-faculty-pending_requests', ShowNewFacultyPendingRequest.as_view(), name='show-new-faculty-pending_requests'),
    path('approve-new-faculty-request', ApproveNewFacultyRequest.as_view(), name='approve-new-faculty-request'),
    path('update-faculty-details', UpdateFacultyDetails.as_view(), name='update-faculty-details'),
    path('show-faculty-username', ShowFacultyUsername.as_view(), name='show-faculty-username'),
    path('show-my-batches', ShowMyBatches.as_view(), name='show-my-batches'),
]
