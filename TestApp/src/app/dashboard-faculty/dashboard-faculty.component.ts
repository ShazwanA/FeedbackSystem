import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServicesService } from '../services/services.service';
import { SignupComponent } from '../signup/signup.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-dashboard-faculty',
  templateUrl: './dashboard-faculty.component.html',
  styleUrls: ['./dashboard-faculty.component.css']
})
export class DashboardFacultyComponent implements OnInit {
  
  // fullNameOfUser: any;

  constructor(
    private addItemDialog: MatDialog,
    private service: ServicesService,
  ) { }

  ngOnInit(): void { }

  // logout(){
  //   this.service.logout();
  // }

  openStudentSignup(userType: any) {
    this.addItemDialog.open(SignupComponent, {
      width: '40%',
      height: '70%',
      data: {row: userType, requestType:'Create', message:'Create User'}
    });
  }

  changePassword() {
      this.addItemDialog.open(ChangePasswordComponent, {
        width: '30%',
        height: '70%',
        data: {requestType:"changePasswordByParent"}
      });
    }

}
