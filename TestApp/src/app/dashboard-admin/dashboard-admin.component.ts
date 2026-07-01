import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { AddCourseComponent } from '../add-course/add-course.component';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { AddSubjectComponent } from '../add-subject/add-subject.component';
import { AssignBatchComponent } from '../assign-batch/assign-batch.component';
// import { FacultySignupComponent } from '../faculty-signup/faculty-signup.component';
import { ServicesService } from '../services/services.service';
import { SignupComponent } from '../signup/signup.component';
import { Router } from '@angular/router';
import { AddFeedbackQuestionComponent } from '../add-feedback-question/add-feedback-question.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private service: ServicesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  openAddNewDepartment() {
    this.dialog.open(AddDepartmentComponent, {
      width: '30%',
      height: '70%',
    });
  }

  openAddNewCourse() {
    this.dialog.open(AddCourseComponent, {
      width: '30%',
      height: '70%',
    });
  }

  openAddNewSubject() {
    this.dialog.open(AddSubjectComponent, {
      width: '30%',
      height: '70%',
    });
  }

  userSignup(userType: any) {
    this.dialog.open(SignupComponent, {
      width: '40%',
      height: '70%',
      data: {row: userType, rquestType:'Create', message:'Create User'}
    });
  }

  // openFacultySignup() {
  //   this.addItemDialog.open(FacultySignupComponent, {
  //     width: '40%',
  //     height: '70%',
  //   });
  // }

  openAssignBatch() {
    this.dialog.open(AssignBatchComponent, {
      width: '30%',
      height: '70%',
    });
  }

  openAddNewCategory() {
    this.dialog.open(AddCategoryComponent, {
      width: '30%',
      height: '70%',
    });
  }

  logout(){
    this.service.logout();
  }

  getUserProfile(){
    this.service.getUserProfile('admin').subscribe((response) => {
      console.log(response);
      this.router.navigate(['user-profile'],
      {
        state: { data: response }
      })
    },
    error =>{
      console.log(error.error); 
    }
    )
  }

  addFeedbackQuestion() {
    this.dialog.open(AddFeedbackQuestionComponent, {
      width: '30%',
      height: '70%',
    });
  }

  changePassword() {
    this.dialog.open(ChangePasswordComponent, {
      width: '30%',
      height: '70%',
      data: {requestType:"changePasswordByParent"}
    });
  }
}
