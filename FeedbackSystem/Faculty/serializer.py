from rest_framework import serializers
from Admin.models import AllUserDetails, BatchDetails
# from .models import TestModelAccordion


class CustomSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return {key: value for key, value in rep.items() if value not in [None, '', [], {}]}


class AllFacultySerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = AllUserDetails
        fields = [
            'id',
            'first_name',
            'last_name',
            'username',
            'gender',
            'date_of_birth',
            'department',
            'user_type',
            'is_active',
            'status',
            'joining_date',
            'experience',
            'qualification',
        ]


class FacultyUsernameSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = AllUserDetails
        fields = [
            'first_name',
            'last_name',
            'username',
            'user_type',
            'is_active',
        ]


class ShowMyBatchesSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = BatchDetails
        fields = [
            'batch_code',
            'batch_time',
            'department,'
            'course',
            'subject',
            'is_active',
            'year',
        ]
