from django.core.cache import cache
from django.db.models import Count, Avg, Q
from django.db.models.functions import ExtractMonth
from datetime import datetime

from Admin.models import (
    AllUserDetails,
    BatchDetails,
    DepartmentDetails,
    CourseDetails,
    SubjectDetails,
    FeedbackByStudent
)
from .feedback_distribution_service import FeedbackDistributionService
from .summary_service import SummaryService
from .feedback_trend_service import FeedbackTrendService
from .department_performance_service import DepartmentPerformanceService
from .top_faculty_service import TopFacultyService
from .recent_feedback_service import RecentFeedbackService


class AdminDashboardService:

    CACHE_KEY = "admin_dashboard"

    @classmethod
    def dashboard(cls):

        dashboard = cache.get(cls.CACHE_KEY)
        summary_service = SummaryService()
        feedback_trend_service = FeedbackTrendService()
        department_performance_service = DepartmentPerformanceService()
        top_faculty_service = TopFacultyService()
        recent_feedback_service = RecentFeedbackService()
        feedback_distribution_service = FeedbackDistributionService()

        if dashboard:
            return dashboard

        dashboard = {
            "summary": summary_service.get_summary(),

            "charts": {
                "feedback_trend": feedback_trend_service.get_feedback_trend(),
                "department_performance": department_performance_service.get_department_performance(),
                "feedback_distribution": feedback_distribution_service.get_feedback_distribution(),
            },
            "top_faculty": top_faculty_service.get_top_faculty(),
            "recent_feedback": recent_feedback_service.get_recent_feedback(),

            "lists": {},
            "tables": {},
            "today_summary": {}
        }

        cache.set(cls.CACHE_KEY, dashboard, timeout=300)

        return dashboard


    @classmethod
    def clear_dashboard_cache(cls):
        cache.delete(cls.CACHE_KEY)
