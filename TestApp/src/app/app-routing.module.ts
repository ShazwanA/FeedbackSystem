import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveNewfacultyComponent } from './approve-newfaculty/approve-newfaculty.component';
import { ApproveNewstudentComponent } from './approve-newstudent/approve-newstudent.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardFacultyComponent } from './dashboard-faculty/dashboard-faculty.component';
import { DashboardStudentComponent } from './dashboard-student/dashboard-student.component';
import { HomeComponent } from './home/home.component';
import { ShowBatchComponent } from './show-batch/show-batch.component';
import { ShowCourseComponent } from './show-course/show-course.component';
import { ShowDepartmentComponent } from './show-department/show-department.component';
import { ShowSubjectComponent } from './show-subject/show-subject.component';
import { ShowfacultyComponent } from './showfaculty/showfaculty.component';
import { ShowstudentComponent } from './showstudent/showstudent.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ShowCategoryComponent } from './show-category/show-category.component';
import { AuthGuardGuard } from './services/auth-guard.guard';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ShowAllFeedbackQuestionsComponent } from './show-all-feedback-questions/show-all-feedback-questions.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FeedbackDashboardPageComponent } from './feedback-dashboard-page/feedback-dashboard-page.component';
import { ShowMyBatchesComponent } from './show-my-batches/show-my-batches.component';



const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'user-login', component: UserLoginComponent},
  {path: 'dashboard-admin', component: DashboardAdminComponent, canActivate:[AuthGuardGuard], data: {usertype: "admin"}},
  {path: 'dashboard-faculty', component: DashboardFacultyComponent, canActivate:[AuthGuardGuard], data: {usertype: "faculty"}},
  {path: 'dashboard-student', component: DashboardStudentComponent, canActivate:[AuthGuardGuard], data: {usertype: "student"}},
  {path: 'display-all-student', component: ShowstudentComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin","faculty"]}},
  {path: 'display-new-student', component: ApproveNewstudentComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin", "faculty"]}},
  {path: 'display-new-faculty', component: ApproveNewfacultyComponent, canActivate:[AuthGuardGuard], data: {usertype: "admin"}},
  {path: 'display-all-faculty', component: ShowfacultyComponent, canActivate:[AuthGuardGuard], data: {usertype: "admin"}},
  {path: 'display-all-courses', component: ShowCourseComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin", "faculty"]}},
  {path: 'display-all-department', component: ShowDepartmentComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin", "faculty"]}},
  {path: 'display-all-subject', component: ShowSubjectComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin", "faculty"]}},
  {path: 'display-all-batch', component: ShowBatchComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin", "faculty"]}},
  {path: 'display-category', component: ShowCategoryComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin", "faculty"]}},
  {path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardGuard]},
  {path: 'display-all-feedback-questions', component: ShowAllFeedbackQuestionsComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin", "faculty"]}},
  {path: 'feedback-dashboard', component: FeedbackDashboardPageComponent, canActivate:[AuthGuardGuard], data: {usertype: ["admin", "faculty", "student"]}},
  {path: 'my-batches', component: ShowMyBatchesComponent, canActivate:[AuthGuardGuard], data: {usertype: ["faculty"]}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ShowstudentComponent, ShowfacultyComponent]
