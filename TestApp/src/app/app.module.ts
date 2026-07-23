import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SignupComponent } from './signup/signup.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { FeedbackbystudentComponent } from './feedbackbystudent/feedbackbystudent.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FacultySignupComponent } from './faculty-signup/faculty-signup.component';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardFacultyComponent } from './dashboard-faculty/dashboard-faculty.component';
import { DashboardStudentComponent } from './dashboard-student/dashboard-student.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApproveNewstudentComponent } from './approve-newstudent/approve-newstudent.component';
import { ApproveNewfacultyComponent } from './approve-newfaculty/approve-newfaculty.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { AddSubjectComponent } from './add-subject/add-subject.component';
import { ShowDepartmentComponent } from './show-department/show-department.component';
import { ShowSubjectComponent } from './show-subject/show-subject.component';
import { AssignBatchComponent } from './assign-batch/assign-batch.component';
import { ShowBatchComponent } from './show-batch/show-batch.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ShowCategoryComponent } from './show-category/show-category.component';
import { AccordianComponent } from './accordian/accordian.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MenuComponent } from './menu/menu.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.service';
import { AddCourseComponent } from './add-course/add-course.component';
import { ShowCourseComponent } from './show-course/show-course.component';
import { ConfirmationPopupComponent, AlertPopupComponent, DetailsAlertPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { AddFeedbackQuestionComponent } from './add-feedback-question/add-feedback-question.component';
import { ShowAllFeedbackQuestionsComponent } from './show-all-feedback-questions/show-all-feedback-questions.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FeedbackDashboardPageComponent } from './feedback-dashboard-admin/feedback-dashboard-page.component';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';
import { ShowMyBatchesComponent } from './show-my-batches/show-my-batches.component';
import { StatCardComponent } from './feedback-dashboard-admin/components/stat-card/stat-card.component';
import { FeedbackTrendComponent } from './feedback-dashboard-admin/components/feedback-trend/feedback-trend.component';
import { DepartmentChartComponent } from './feedback-dashboard-admin/components/department-chart/department-chart.component';
import { TopFacultyComponent } from './feedback-dashboard-admin/components/top-faculty/top-faculty.component';
import { TodaySummaryComponent } from './feedback-dashboard-admin/components/today-summary/today-summary.component';
import { RecentFeedbackComponent } from './feedback-dashboard-admin/components/recent-feedback/recent-feedback.component';
import { DepartmentPerformanceComponent } from './feedback-dashboard-admin/components/department-performance/department-performance.component';
import { FeedbackDistributionComponent } from './feedback-dashboard-admin/components/feedback-distribution/feedback-distribution.component';
import { QuickActionsComponent } from './feedback-dashboard-admin/components/quick-actions/quick-actions.component';
import { StarRatingComponent } from './shared/star-rating/star-rating.component';
import { EmptyStateComponent } from './feedback-dashboard-admin/components/empty-state/empty-state.component';
import { ErrorStateComponent } from './feedback-dashboard-admin/components/error-state/error-state.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserLoginComponent,
    SignupComponent,
    FeedbackbystudentComponent,
    FacultySignupComponent,
    routingComponents,
    DashboardFacultyComponent,
    DashboardStudentComponent,
    DashboardAdminComponent,
    ApproveNewstudentComponent,
    ApproveNewfacultyComponent,
    AddDepartmentComponent,
    AddSubjectComponent,
    ShowDepartmentComponent,
    ShowSubjectComponent,
    AssignBatchComponent,
    ShowBatchComponent,
    AddCategoryComponent,
    ShowCategoryComponent,
    AccordianComponent,
    MenuComponent,
    UserProfileComponent,
    AddCourseComponent,
    ShowCourseComponent,
    ConfirmationPopupComponent,
    AlertPopupComponent,
    DetailsAlertPopupComponent,
    AddFeedbackQuestionComponent,
    ShowAllFeedbackQuestionsComponent,
    ChangePasswordComponent,
    FeedbackDashboardPageComponent,
    FeedbackPageComponent,
    ShowMyBatchesComponent,
    StatCardComponent,
    FeedbackTrendComponent,
    DepartmentChartComponent,
    TopFacultyComponent,
    TodaySummaryComponent,
    RecentFeedbackComponent,
    DepartmentPerformanceComponent,
    FeedbackDistributionComponent,
    QuickActionsComponent,
    StarRatingComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatTableModule,
    MatNativeDateModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatCardModule,
    MatListModule,
    NgChartsModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
