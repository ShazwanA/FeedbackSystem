from datetime import date

from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.contrib.auth.models import BaseUserManager
from .custom_base_model import CustomBaseModel
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

class AllUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_active', True)
        user = self.create_user(username, password, **extra_fields)
        user.save(using=self._db)
        return user

    def get_by_natural_key(self, username):
        return self.get(username=username)


class DepartmentDetails(CustomBaseModel):
    department_code = models.CharField(max_length=10, primary_key=True)
    department_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = "department_details"


class CourseDetails(CustomBaseModel):
    course_code = models.CharField(max_length=10, primary_key=True)
    course_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = "course_details"


class AllUserDetails(CustomBaseModel):
    username = models.CharField(unique=True, blank=False, max_length=35)
    password = models.CharField(max_length=100)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20, null=True, blank=True)
    gender = models.CharField(max_length=6, null=True, blank=True)
    date_of_birth = models.CharField(max_length=60, null=True, blank=True)
    user_type = models.CharField(max_length=15, blank=True)
    is_active = models.BooleanField(default=False)
    status = models.CharField(max_length=20, null=True, blank=True)
    department = models.ForeignKey(DepartmentDetails, max_length=10, on_delete=models.CASCADE, null=True)

    joining_date = models.CharField(max_length=60, null=True, blank=True)
    qualification = models.CharField(max_length=35, null=True, blank=True)
    experience = models.IntegerField(null=True, blank=True)

    father_name = models.CharField(max_length=35, null=True, blank=True)
    roll_no = models.IntegerField(default=None, null=True, blank=True)
    course = models.ForeignKey(CourseDetails, max_length=6, on_delete=models.CASCADE, null=True)

    USERNAME_FIELD = "username"
    objects = AllUserManager()

    class Meta:
        managed = True
        db_table = "all_user_details"


class CategoryDetails(CustomBaseModel):
    category_code = models.CharField(max_length=10, primary_key=True)
    category_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = "category_details"


class SubjectDetails(CustomBaseModel):
    subject_code = models.CharField(max_length=10, primary_key=True)
    subject_name = models.CharField(max_length=50)
    category = models.ForeignKey(CategoryDetails, max_length=50, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = "subject_details"


class BatchDetails(CustomBaseModel):
    batch_code = models.CharField(max_length=10, primary_key=True)
    batch_time = models.CharField(max_length=60)
    faculty = models.CharField(blank=False, max_length=35)
    faculty_full_name = models.CharField(max_length=35, null=True)
    department = models.ForeignKey(DepartmentDetails, max_length=6, on_delete=models.CASCADE)
    course = models.ForeignKey(CourseDetails, max_length=6, on_delete=models.CASCADE)
    subject = models.ForeignKey(SubjectDetails, max_length=6, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)
    year = models.IntegerField(default=date.today().year)

    class Meta:
        managed = True
        db_table = "batch_details"


class FeedbackQuestionsData(CustomBaseModel):
    question_added_on = models.DateField()
    question = models.CharField(max_length=100)
    option_a = models.CharField(max_length=100)
    option_b = models.CharField(max_length=100)
    option_c = models.CharField(max_length=100)
    option_d = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = "feedback_questions_data"


class FeedbackByStudent(CustomBaseModel):
    faculty = models.CharField(max_length=35)
    student = models.CharField(max_length=35)
    month = models.CharField(max_length=12)
    year = models.IntegerField()
    feedback_submitted_on = models.DateField()
    question = models.ForeignKey(FeedbackQuestionsData, on_delete=models.CASCADE)
    answer = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    remarks = models.TextField(max_length=200)
    batch = models.ForeignKey(BatchDetails, on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = "feedback_by_student"


# for testing purpose
class TestModel(models.Model):
    def fileName(self, filename):
        return '/'.join([self.username, filename])
    username = models.CharField(max_length=20, primary_key=True)
    dataFile = models.FileField(upload_to=fileName, blank=True)

    # password = models.CharField(max_length=12)
