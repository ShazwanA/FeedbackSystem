from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import LoginUser, Logout, UserProfile, AddNewUser, AddNewCourse,\
                    ShowAllBatches, ShowAllCourses, ShowAllDepartments, AddNewDepartment,\
                    AddNewSubject, AddNewCategory, ShowAllCategories, UpdateDepartment, UpdateCourse,\
                    UpdateCategory, ShowAllSubjects, UpdateSubject, AssignNewBatch, DeleteBatch, UpdateBatch,\
                    AddFeedbackQuestion, ShowAllFeedbackQuestions, UpdateFeedbackQuestion, DeleteFeedbackQuestion,\
                    ChangePassword, ChangePasswordByParent, ShowAllUsernames

#
urlpatterns = [
    path(r'login-user', LoginUser.as_view(), name='login'),
    path('add-user', AddNewUser.as_view(), name='add-user'),
    path('user-profile', UserProfile.as_view(), name='user-profile'),
    path('change-password', ChangePassword.as_view(), name='change-password'),
    path('change-password-by-parent', ChangePasswordByParent.as_view(), name='change-password-by-parent'),
    path('all-user-names', ShowAllUsernames.as_view(), name='all-user-names'),
    path('logout', Logout.as_view(), name='logout'),
    path('add-new-course', AddNewCourse.as_view(), name='add-new-course'),
    path('show-all-courses', ShowAllCourses.as_view(), name='all-courses'),
    path('update-course', UpdateCourse.as_view(), name='update-course'),
    path('add-new-department', AddNewDepartment.as_view(), name='add-new-department'),
    path('show-all-departments', ShowAllDepartments.as_view(), name='all-departments'),
    path('update-department', UpdateDepartment.as_view(), name='update-department'),
    path('add-new-subject', AddNewSubject.as_view(), name='add-new-subject'),
    path('show-all-subjects', ShowAllSubjects.as_view(), name='all-subjects'),
    path('update-subject', UpdateSubject.as_view(), name='update-subject'),
    path('show-all-category', ShowAllCategories.as_view(), name='show-all-category'),
    path('add-new-category', AddNewCategory.as_view(), name='add-new-category'),
    path('update-category', UpdateCategory.as_view(), name='update-category'),
    path('show-all-batches', ShowAllBatches.as_view(), name='show-all-batches'),
    path('assign-new-batch', AssignNewBatch.as_view(), name='assign-new-batch'),
    path('update-batch', UpdateBatch.as_view(), name='update-batch'),
    path('delete-batch', DeleteBatch.as_view(), name='delete-batch'),
    path('add-feedback-question', AddFeedbackQuestion.as_view(), name='add-feedback-question'),
    path('show-all-feedback-questions', ShowAllFeedbackQuestions.as_view(), name='show-all-feedback-questions'),
    path('update-feedback-question', UpdateFeedbackQuestion.as_view(), name='update-feedback-question'),
    path('delete-feedback-question', DeleteFeedbackQuestion.as_view(), name='delete-feedback-question'),

]

urlpatterns += static(settings.MEDIA_URL, doccument_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, doccument_root=settings.STATIC_ROOT)
