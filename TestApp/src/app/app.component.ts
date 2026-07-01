import { Component, ViewChild } from '@angular/core';
import { Home } from './Home';
import { Validators, FormBuilder } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SignupComponent } from './signup/signup.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { FacultySignupComponent } from './faculty-signup/faculty-signup.component';
import { ServicesService } from './services/services.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TestApp';
  imageTest = false;
  filedata : any
  isFaculty: boolean = false;
  isStudent: boolean = false;
  isUserLoggedIn = false;


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private formbuild: FormBuilder,
    private signupDialog: MatDialog,
    private signinDialog: MatDialog,
    private services:ServicesService,
    ){ }

    ngOnIn(){
      if(localStorage.getItem('usertype') == 'faculty')
        this.isFaculty = true;
      
      if(localStorage.getItem('usertype') == 'student')
        this.isStudent = true;
      
      if(this.services.isSignedIn())
        this.isUserLoggedIn = true;
      else
        this.isUserLoggedIn = false
    }

  openStudentSignup() {
    this.signupDialog.open(SignupComponent, {
      width: '40%',
      height: '70%',
    });
  }

  openFacultySignup() {
    this.signupDialog.open(FacultySignupComponent, {
      width: '40%',
      height: '70%',
    });
  }

  openSigninDialog() {
    this.signinDialog.open(UserLoginComponent, {
      width: '40%',
      height: '70%',
    });
  }

}