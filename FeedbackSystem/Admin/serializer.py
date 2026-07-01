from rest_framework import serializers
from .models import TestModel, CategoryDetails, AllUserDetails, BatchDetails,\
                    SubjectDetails, DepartmentDetails, CourseDetails, FeedbackQuestionsData


class CustomSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return {key: value for key, value in rep.items() if value not in [None, '', [], {}]}


class CourseSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = CourseDetails
        fields = (
            'course_name',
            'course_code',
            'is_active',
        )


class DepartmentSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = DepartmentDetails
        fields = (
            'department_name',
            'department_code',
            'is_active',
        )


class SubjectSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = SubjectDetails
        fields = (
            'subject_name',
            'subject_code',
            'category',
            'is_active',
        )


class BatchSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = BatchDetails
        fields = (
            'batch_code',
            'faculty',
            'faculty_full_name',
            'batch_time',
            'course',
            'subject',
            'department',
            'is_active',
        )


class CategorySerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = CategoryDetails
        fields = (
            'category_name',
            'category_code',
            'is_active',
        )


class UserProfileSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = AllUserDetails
        fields = [
            'id',
            'user_type',
            'first_name',
            'last_name',
            'username',
            'gender',
            'date_of_birth',
            'father_name',
            'roll_no',
            'course_id',
            'status',

            'joining_date',
            'qualification',
            'experience',
            'is_active'
        ]


class AddNewUserSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = AllUserDetails
        fields = [
            'first_name',
            'last_name',
            'username',
            'password',
            'gender',
            'date_of_birth',
            'status',
            'department',
            'joining_date',
            'qualification',
            'experience'
            'father_name',
            'roll_no',
            'course',
            'user_type',
            'is_active'
        ]


class FeedbackQuestionSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = FeedbackQuestionsData
        fields = [
            'id',
            'question_added_on',
            'question',
            'option_a',
            'option_b',
            'option_c',
            'option_d',
            'is_active'
        ]


class AllUserNamesSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = AllUserDetails
        fields = [
            'username',
        ]
