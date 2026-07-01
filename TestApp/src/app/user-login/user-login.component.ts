import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Route } from '@angular/router';
import { FacultySignupComponent } from '../faculty-signup/faculty-signup.component';
import { ServicesService } from '../services/services.service';
import { SignupComponent } from '../signup/signup.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  data = false;
  user_details:any;
  state:any;
  isInvalid: boolean = false;
  showHidePassword = true;
  responseMsg = ''

  usersList: Users[] = [
    {users : 'Admin', userValue: 'admin'},
    {users : 'Faculty', userValue: 'faculty'},
    {users : 'Student', userValue: 'student'},
  ];
  result = '';

  constructor(
    private formbuild: FormBuilder,
    private signupDialog: MatDialog,
    private signinDialog: MatDialog,
    private services: ServicesService,
    private http: HttpClient,
    private route: Router,
    private matdailog: MatDialog,
    ){ }
    loginform = this.formbuild.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      user_type : ['', Validators.required]
    }
    )

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

  get username(){
    return this.loginform.get("username");
  }
  get password(){
    return this.loginform.get("password");
  }
  proceed(){
    console.warn(this.loginform.value)
  }

  ngOnInit(): void { }


  login(){
  this.services.userLogin(this.loginform.value.username, this.loginform.value).subscribe({
    next: (result) => {  
      this.isInvalid = false;
      localStorage.setItem('username', result.username!);
      localStorage.setItem('STATE', result.STATE);
      localStorage.setItem('usertype', result.user_type);
      localStorage.setItem('access_token', result.access)
      localStorage.setItem('refresh_token', result.refresh)
      
  
      this.matdailog.closeAll();
      if (result.user_type == 'admin')
        this.route.navigate(['dashboard-admin']);
      else if (result.user_type == 'faculty')
        this.route.navigate(['dashboard-faculty']);
      else if (result.user_type == 'student')
        this.route.navigate(['dashboard-student']);
      else{
        console.log('No user role found');
        this.route.navigate([''])
        }
    },
    error: (err) => {
      console.error(err.error);
      this.isInvalid = true;
      this.responseMsg = err.error
    }
  });
  }



  // test fuctions
  testLogin(){
    this.services.testAdminLogin(this.loginform.value).subscribe((result)=>{
      console.log(result);
      
    },
    error =>{
      console.log(error.error);
      
    }
    )
  }

  test(){
    console.log(this.loginform.value.username);
    
  }

}

interface Users {
  users:string;
  userValue:string
}
