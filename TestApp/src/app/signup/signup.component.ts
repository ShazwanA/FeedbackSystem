import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ServicesService } from '../services/services.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserLoginComponent } from '../user-login/user-login.component';
import { SharedService } from '../services/shared.service';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [ServicesService]
})

export class SignupComponent implements OnInit {
  loginformcontrols: any;
  convertDate = new DatePipe("en-US");
  allCourses: any;
  allDepartments: any;
  // data:any;
  submitBtn: string = "Create User";
  isReadOnly = false;
  userRole = "";
  isStaff = false;
  showHidePassword = true;
  // image = "";
  // imageWidth = 0;
  // imageHeight = 0;
  responseMsg = '';
  userType = '';
  workStatus = [];

// costructor method
  constructor(
    private router: Router,
    private services:ServicesService,
    private formbuild: FormBuilder,
    private dialog: MatDialog,
    public sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) { }

  userSignupFormModel = this.formbuild.group({
    first_name: ['', Validators.required],
    last_name: [],
    username: [{value:'', disabled:true}, [Validators.required, Validators.email]],
    password: [
    '',
    [
      ...(this.editData.requestType === 'Create' ? [Validators.required] : []),
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern('[a-zA-Z0-9]+$')
    ]
  ], //, Validators.pattern('[a-zA-Z0-9]+$')],
    user_type: [{value:'', disabled:true}, Validators.required],
    gender: [],
    department: [],
    status:[],
    experience: [],
    qualification:[],
    joining_date:[],

    course: [],
    date_of_birth: [],
    roll_no: [],
    father_name: [],
    is_active: [false]
  })

  ngOnInit(): void {
    this.services.allCourses(true).subscribe({
        next: (response) => {
        this.allCourses = response;
        },
        error: (error: HttpErrorResponse) => {
          
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
            this.services.logout();
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

    this.services.allDepartments(true).subscribe({
      next: (response) => {
      this.allDepartments = response
      },
      error: (error: HttpErrorResponse) => {
        if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
          this.services.logout();
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
    
    if(this.services.getRole() == 'admin' || this.services.getRole() == 'faculty')
      this.isStaff = true;

      if(this.editData.requestType==='Update' || this.editData.requestType==='Approve')
      {
        this.submitBtn = this.editData.requestType;
        this.isReadOnly = true;
        this.showHidePassword = false;
        // this.userType = this.editData.user_type
        this.userType = this.editData.row['user_type']
        this.userSignupFormModel.controls['user_type'].setValue(this.editData.row['user_type']);
        this.userSignupFormModel.controls['first_name'].setValue(this.editData.row['first_name']);
        this.userSignupFormModel.controls['last_name'].setValue(this.editData.row['last_name']);
        this.userSignupFormModel.controls['username'].setValue(this.editData.row['username']);
        this.userSignupFormModel.controls['password'].setValue(this.editData.row['password']);
        this.userSignupFormModel.controls['gender'].setValue(this.editData.row['gender']);
        this.userSignupFormModel.controls['date_of_birth'].setValue(this.editData.row['date_of_birth']);
        this.userSignupFormModel.controls['father_name'].setValue(this.editData.row['father_name']);
        this.userSignupFormModel.controls['course'].setValue(this.editData.row['course_id']);
        this.userSignupFormModel.controls['department'].setValue(this.editData.row['department_id']);
        this.userSignupFormModel.controls['roll_no'].setValue(this.editData.row['roll_no']);
        this.userSignupFormModel.controls['joining_date'].setValue(this.editData.row['joining_date']);
        this.userSignupFormModel.controls['qualification'].setValue(this.editData.row['qualification']);
        this.userSignupFormModel.controls['experience'].setValue(this.editData.row['experience']);
        this.userSignupFormModel.controls['is_active'].setValue(this.editData.row['is_active']);
        this.userSignupFormModel.controls['status'].setValue(this.editData.row['status']);
    }
      else{
        this.userType = this.editData.row
        this.userSignupFormModel.get('username')?.enable();
        this.userSignupFormModel.get('user_type')?.enable();
    }
  }

proceed(){  
  if(this.editData.requestType === 'Create')
    {
      this.registerUser();
    }
  else if(this.editData.requestType === 'Update')
    {      
      this.updateUserDetails();
    }
  else if(this.editData.requestType === 'Approve')
    {
      this.approveUser();
    }
}

registerUser(){
      this.services.registerNewUser(this.userSignupFormModel.getRawValue()).subscribe({
        next: (response) => {
        this.dialog.closeAll()
        this.alertPopup('Success', response.message);
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
        });
        },
        error: (error: HttpErrorResponse) => {
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
            this.services.logout();
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

updateUserDetails(){
  if (this.editData.row['user_type'] == 'student'){    
    this.services.updateStudent(this.userSignupFormModel.getRawValue()).subscribe({
      next: (response) => {
        this.dialog.closeAll();
        this.alertPopup('Success', response);
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      
        });
      },
      error: (error: HttpErrorResponse) => {
        if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
          this.services.logout();
          this.alertPopup('Error', 'Session is expired. Please Login')
        }
        else{
          this.alertPopup('Error', error.error)
          this.responseMsg = error.error
        }
      }
    });
  }
  else if (this.editData.row['user_type'] == 'faculty'){
    this.services.updateFaculty(this.userSignupFormModel.getRawValue()).subscribe({
        next: (response) => {
          this.dialog.closeAll();
          this.alertPopup('Success', response);
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        
          });
        },
        error: (error: HttpErrorResponse) => {
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
            this.services.logout();
            this.alertPopup('Error', 'Session is expired. Please Login')
          }
          else{
            this.alertPopup('Error', error.error)
            this.responseMsg = error.error
          }
        }
      });
    }
}

approveUser(){
  if (this.editData.row['user_type']=='student'){
      this.services.approveStudentRequest(this.userSignupFormModel.getRawValue()).subscribe({
        next:(data)=>{
          this.dialog.closeAll()
          this.alertPopup('Success', data);
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      },
        error: (error: HttpErrorResponse) => {
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
            this.services.logout();
            this.alertPopup('Error', 'Session is expired. Please Login')
          }
          else{
            this.alertPopup('Error', error.error)
          }
        }
      });
    }
    else if (this.editData.row['user_type']=='faculty'){
      this.services.approveFaculty(this.userSignupFormModel.getRawValue()).subscribe({
        next:(data)=>{
          this.dialog.closeAll()
          this.alertPopup('Success', data);
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      },
        error: (error: HttpErrorResponse) => {
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
            this.services.logout();
            this.alertPopup('Error', 'Session is expired. Please Login')
          }
          else{
            this.alertPopup('Error', error.error)
          }
        }
      });
    }
  }

openLoginDialog() {
  this.dialog.open(UserLoginComponent, {
    width: '40%',
    height: '70%',
  });
}


//just for testing things
testMethod(){
  alert(this.userSignupFormModel.value.is_active);
}

// onChangeImage(event:any){
//   this.imageHeight = 200;
//   this.imageWidth = 200;
//   const file = event.target.files[0]
//   var read = new FileReader();
//   read.onload = (data:any) => {
//     this.image = data.target.result;
//   }
//   read.readAsDataURL(file)
// }

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

