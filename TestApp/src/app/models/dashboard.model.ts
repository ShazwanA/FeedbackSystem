// export interface DashboardData {
//   summary: DashboardCard[];
//   charts: {
//     feedback_trend: FeedbackTrend[];
//     department_performance: DepartmentPerformance[];
//   };
//   recent_feedback: RecentFeedback[];
//   top_faculty: TopFaculty[];
//   today_summary: TodaySummary;
// }

export interface DashboardCard {
    title: string;
    value: number;
    icon: string;
    color: string;
    subtitle: string;
    route?: string;
}