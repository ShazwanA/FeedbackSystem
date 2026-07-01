from rest_framework import serializers
from Admin.models import AllUserDetails, BatchDetails


class CustomSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return {key: value for key, value in rep.items() if value not in [None, '', [], {}]}


class AllStudentSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = AllUserDetails
        fields = (
            'first_name',
            'last_name',
            'username',
            'gender',
            'date_of_birth',
            'father_name',
            'roll_no',
            'course',
            'department',
            'user_type',
            'is_active',
            'is_deleted',
            'status',
        )


class FeedbackDashboardPageSerializer(CustomSerializer, serializers.ModelSerializer):
    class Meta:
        model = BatchDetails
        fields = (
            'batch_code',
            'batch_time',
            'faculty',
            'faculty_full_name',
            'department',
            'course',
            'subject',
            'is_active',
            'is_deleted',
            'year',
        )

