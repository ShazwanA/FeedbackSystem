from django.db.models import Count, Q, Avg

from Admin.models import AllUserDetails, BatchDetails, FeedbackByStudent, \
    DepartmentDetails, CourseDetails, SubjectDetails


class SummaryService:

    def get_summary(self):

        users = (
            AllUserDetails.objects
            .filter(is_deleted=False)
            .aggregate(
                total_faculty=Count(
                    "user_id",
                    filter=Q(user_type="faculty")
                ),
                total_students=Count(
                    "user_id",
                    filter=Q(user_type="student")
                ),
                total_active_students=Count(
                    "user_id",
                    filter=(Q(user_type="student") & Q(is_active=True))
                ),
                total_active_faculty=Count(
                    "user_id",
                    filter=(Q(user_type="faculty") & Q(is_active=True))
                ),
            )
        )

        batches = (
            BatchDetails.objects
            .filter(is_deleted=False)
            .aggregate(
                total_batches=Count("id"),
                active_batches=Count(
                    "id",
                    filter=Q(is_active=True)
                ),
                inactive_batches=Count(
                    "id",
                    filter=Q(is_active=False)
                )
            )
        )

        feedback = (
            FeedbackByStudent.objects
            .filter(is_deleted=False)
            .aggregate(
                total_feedback=Count("id"),
                average_rating=Avg("answer")
            )
        )

        total_departments = DepartmentDetails.objects.filter(
            is_deleted=False
        ).count()

        total_courses = CourseDetails.objects.filter(
            is_deleted=False
        ).count()

        total_subjects = SubjectDetails.objects.filter(
            is_deleted=False
        ).count()

        return [

            {
                "title": "Faculty",
                "value": users["total_faculty"],
                "icon": "groups",
                "color": "#1976d2",
                "subtitle": "Registered Faculty",
                "route": "/faculty"
            },

            {
                "title": "Students",
                "value": users["total_students"],
                "icon": "school",
                "color": "#43a047",
                "subtitle": "Registered Students",
                "route": "/student"
            },

            {
                "title": "Batches",
                "value": batches["total_batches"],
                "icon": "menu_book",
                "color": "#fb8c00",
                "subtitle": f'{batches["active_batches"]} Active Batches',
                "route": "/batch"
            },

            {
                "title": "Departments",
                "value": total_departments,
                "icon": "business",
                "color": "#5e35b1",
                "subtitle": "Departments",
                "route": "/department"
            },

            {
                "title": "Courses",
                "value": total_courses,
                "icon": "library_books",
                "color": "#00897b",
                "subtitle": "Courses",
                "route": "/course"
            },

            {
                "title": "Subjects",
                "value": total_subjects,
                "icon": "book",
                "color": "#e53935",
                "subtitle": "Subjects",
                "route": "/subject"
            },

            {
                "title": "Feedback",
                "value": feedback["total_feedback"],
                "icon": "rate_review",
                "color": "#8e24aa",
                "subtitle": "Feedback Submitted",
                "route": "/feedback"
            },

            {
                "title": "Average Rating",
                "value": round(
                    feedback["average_rating"] or 0,
                    2
                ),
                "icon": "star",
                "color": "#fbc02d",
                "subtitle": "Overall Rating",
                "route": "/feedback"
            }

        ]