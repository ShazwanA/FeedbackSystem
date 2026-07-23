import { Component, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { UserLoginComponent } from '../user-login/user-login.component';
import { FacultySignupComponent } from '../faculty-signup/faculty-signup.component';
import { ServicesService } from '../services/services.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  title = 'TestApp';
  imageTest = false;
  filedata : any
  isFaculty: boolean = false;
  isStudent: boolean = false;
  isUserLoggedIn = false;
  userName: any;
  userType: any;
  redirectLink: any;


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private services:ServicesService,
    private router: Router,
    private http: HttpClient,
  
    ){ }

    ngOnInit(){
      
      if(localStorage.getItem('usertype') == 'faculty')
        this.isFaculty = true;
      
      if(localStorage.getItem('usertype') == 'student')
        this.isStudent = true;
      
      if(this.services.isSignedIn())
      {
        this.isUserLoggedIn = true;
          this.userName = localStorage.getItem('username')
      }
      else
        this.isUserLoggedIn = false
    }

  userSignup(row:any) {
    this.dialog.open(SignupComponent, {
      width: '40%',
      height: '70%',
      data: {row:row, requestType:'Create', message:'Create User'}
    });
  }

  openFacultySignup() {
    this.dialog.open(FacultySignupComponent, {
      width: '40%',
      height: '70%',
    });
  }

  openSigninDialog() {
    this.dialog.open(UserLoginComponent, {
      width: '40%',
      height: '70%',
    });
  }

  redirectToDashboard(){
    this.userType = this.services.getRole();
    if(this.userType == 'admin')
      this.router.navigate(['/dashboard-admin'])
    else if(this.userType == 'faculty')
      this.router.navigate(['/dashboard-faculty'])
    else if(this.userType == 'student')
    this.router.navigate(['/dashboard-student'])
  }

  changePassword() {
    this.dialog.open(ChangePasswordComponent, {
      width: '30%',
      height: '70%',
      data: {requestType:'changePassword'}
    });
  }

  logout(){
    this.services.logout();
  }

  userData(){
    this.services.userData().subscribe(response =>{
      console.log(response);
      
    },
    error =>{
      // if(error.status == 401)
      //   alert("User not logged in or session expired")
      console.log(error.status);
      
    }
    )
  }

  // logoutUser(){
  //   this.services.logoutUser().subscribe(response =>{
  //     console.log(response);
      
  //   })
  // }

//   createAdmin(){
//     return this.http.post<any>('http://127.0.0.1:8090/Admin/create-super-user', '').subscribe({
//     next: (result) => {
//       console.log(result);
//   }
// });
// }
}
