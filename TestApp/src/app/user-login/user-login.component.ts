import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Route } from '@angular/router';
import { FacultySignupComponent } from '../faculty-signup/faculty-signup.component';
import { ServicesService } from '../services/services.service';
import { SignupComponent } from '../signup/signup.component';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { SharedService } from '../shared/shared.service';

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

  result = '';

  constructor(
    private formbuild: FormBuilder,
    private signupDialog: MatDialog,
    private signinDialog: MatDialog,
    private services: ServicesService,
    public sharedServices: SharedService,
    private router: Router,
    private dialog: MatDialog,
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
      
  
      this.dialog.closeAll();
      if (result.user_type == 'admin')
        this.router.navigate(['dashboard-admin']);
      else if (result.user_type == 'faculty')
        this.router.navigate(['dashboard-faculty']);
      else if (result.user_type == 'student')
        this.router.navigate(['dashboard-student']);
      else{
        console.log('No user role found');
        this.router.navigate([''])
        }
    },
    error: (error: HttpErrorResponse) => {
              
              if(error.status==401){
                this.services.logout();
                this.dialog.closeAll();
                this.alertPopup('Error', 'Session is expired. Please Login');
              }
              else{
                this.alertPopup('Error Raised', error.error)
                this.responseMsg = error.error
                const currentUrl = this.router.url;
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([currentUrl]);
                });
              }
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

  alertPopup(title: any, message: any){
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        width: '400px',
        data: {
          title: title,
          message: message
        }
      });
    }

}

interface Users {
  users:string;
  userValue:string
}
