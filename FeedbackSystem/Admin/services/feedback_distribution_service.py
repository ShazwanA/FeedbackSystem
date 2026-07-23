from django.db.models import Count

from Admin.models import FeedbackByStudent


class FeedbackDistributionService:

    @classmethod
    def get_feedback_distribution(cls):

        distribution = (
                        FeedbackByStudent.objects
                        .filter(is_deleted=False)
                        .values("answer")
                        .annotate(total=Count("id"))
                       )
        rating_map = {
                        item["answer"]: item["total"]
                        for item in distribution
                     }

        labels = {
            5: "Excellent",
            4: "Very Good",
            3: "Good",
            2: "Fair",
            1: "Poor"
        }

        result = []

        for rating in range(5, 0, -1):

            result.append({
                "rating": rating,
                "label": labels[rating],
                "count": rating_map.get(rating, 0)
            })

        return result
