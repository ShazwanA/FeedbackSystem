from django.db.models import Avg, Count

from Admin.models import FeedbackByStudent


class DepartmentPerformanceService:
    def get_department_performance(self):

        queryset = (FeedbackByStudent.objects.filter(is_deleted=False)
                    .values("batch__department_id",
                            "batch__department__department_name")
                    .annotate(
            average_rating=Avg("answer"),
            total_feedback=Count("id")
        )
                    .order_by("-average_rating")
                    )

        result = []

        for row in queryset:
            result.append({
                "department": row["batch__department__department_name"],
                "rating": round(row["average_rating"], 2),
                "feedback_count": row["total_feedback"]

            })

        return result
