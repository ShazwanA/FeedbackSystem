from django.db.models import Avg, Count

from Admin.models import FeedbackByStudent


class TopFacultyService:

    def get_top_faculty(self):

        return list(
            FeedbackByStudent.objects
            .filter(is_deleted=False)
            .values(
                "faculty_id",
                "faculty__full_name",
                "batch__department__department_name"
            )
            .annotate(
                average_rating=Avg("answer"),
                total_feedback=Count("id")
            )
            .filter(total_feedback__gte=10)
            .order_by(
                "-average_rating",
                "-total_feedback"
            )[:5]
        )
