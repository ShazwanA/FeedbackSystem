from Admin.models import FeedbackByStudent


class RecentFeedbackService:

    @classmethod
    def get_recent_feedback(cls):

        queryset = (

            FeedbackByStudent.objects.filter(is_deleted=False)
            .select_related(
                "student",
                "faculty",
                "batch"
            )
            .order_by("-created_at")[:5]
        )

        result = []

        for feedback in queryset:

            result.append({
                "student": f"{feedback.student.full_name}",
                "faculty": f"{feedback.faculty.full_name}",
                "subject": feedback.subject.subject_name,
                "rating": feedback.answer,
                "submitted_on": feedback.created_at.strftime("%d-%m-%Y")
            })

        return result
