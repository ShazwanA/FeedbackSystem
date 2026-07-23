from datetime import datetime

from django.db.models import Count
from django.db.models.functions import ExtractMonth

from Admin.models import FeedbackByStudent


class FeedbackTrendService:

    def get_feedback_trend(self):

        current_year = datetime.now().year

        queryset = (
            FeedbackByStudent.objects
            .filter(
                is_deleted=False,
                year=current_year
            )
            .annotate(submitted_month=ExtractMonth("feedback_submitted_on"))
            .values("submitted_month")
            .annotate(count=Count("id"))
            .order_by("submitted_month")
        )

        months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]

        trend = []

        data = {item["month"]: item["count"] for item in queryset}

        for month in range(1, 13):
            trend.append({

                "month": months[month - 1],

                "count": data.get(month, 0)

            })

        return trend
