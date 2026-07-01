import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ServicesService } from '../services/services.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserLoginComponent } from '../user-login/user-login.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-faculty-signup',
  templateUrl: './faculty-signup.component.html',
  styleUrls: ['./faculty-signup.component.css']
})
export class FacultySignupComponent implements OnInit {

  loginformcontrols: any;
  convertDate = new DatePipe("en-US");
  allClasses: any;
  allSubjects: any;
  allDepartments: any;
  data:any;
  updateBtn: string = "Create user";
  isReadOnly = false;
  isAdmin = false;
  showHidePassword = true;
  invalidEmail = false;
  responseMsg = '';

  constructor(
    private services:ServicesService,
    private formbuild: FormBuilder,
    private dialog: MatDialog,
    private http: HttpClient,
    private route: Router,
    public sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { 

    // this.services.allSubject().subscribe((data)=>{
    //   this.allSubjects = data;
    //   console.log(this.allSubjects)
    // });

    this.services.allDepartments(true).subscribe((data)=>{
      this.allDepartments = data;
      console.log(this.allDepartments)
    });
  }

  facultySignupFormModel = this.formbuild.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required], // Validators.pattern('[a-zA-Z0-9@#$%^&*]+$')],
    gender: ['', Validators.required],
    date_of_birth: ['', Validators.required],
    department: ['', Validators.required],
    joining_date: ['', Validators.required],
    qualification: ['', Validators.required],
    experience: [],
    user_type: ['faculty', Validators.required],
    status: [''],
    is_active: [false]
  })

  ngOnInit(): void {

    if(this.services.getRole() == 'admin')
      this.isAdmin = true;

    if(this.editData)
    {
      this.updateBtn = "Update user";
      this.isReadOnly = true;
      this.showHidePassword = false;
      this.facultySignupFormModel.controls['first_name'].setValue(this.editData.first_name);
      this.facultySignupFormModel.controls['last_name'].setValue(this.editData.last_name);
      this.facultySignupFormModel.controls['username'].setValue(this.editData.facul_username);
      this.facultySignupFormModel.controls['password'].setValue(this.editData.password);
      this.facultySignupFormModel.controls['gender'].setValue(this.editData.gender);
      this.facultySignupFormModel.controls['date_of_birth'].setValue(this.editData.date_of_birth);
      this.facultySignupFormModel.controls['department'].setValue(this.editData.department);
      this.facultySignupFormModel.controls['joining_date'].setValue(this.editData.joining_date);
      this.facultySignupFormModel.controls['qualification'].setValue(this.editData.qualification);
      this.facultySignupFormModel.controls['experience'].setValue(this.editData.experience);
    }

  }

  registerNewFaculty(){

    if(!this.editData)
    {
        this.services.registerNewUser(this.facultySignupFormModel.value).subscribe({
          next: (result) => {
            console.log(result);
            
        
            // this.isInvalid = false;
            // localStorage.setItem('username', this.loginform.value.username!);
            // localStorage.setItem('STATE', 'true');
            // localStorage.setItem('usertype', this.loginform.value.user_type!);
        
            // this.matdailog.closeAll();
            // this.route.navigate(['dashboard-admin']);
          },
          error: (err) => {
            console.error(err.error);
            this.responseMsg = err.error
            // this.isInvalid = true;
            // this.responseMsg = err.error
          }
        });

    }
  else{
    this.updateFacultyDetails();
  }
}

  updateFacultyDetails(){
    this.services.updateFaculty(this.facultySignupFormModel.value).subscribe(
      response => {
        alert("Record updated successfully");
        location.reload();
        // this.facultySignupFormModel.reset();
      },
      error => console.log("Error ",error)
      
    );
  }

  openLoginDialog() {
    this.dialog.open(UserLoginComponent, {
      width: '40%',
      height: '70%',
    });
  }

  checkEmail(){
    if(this.facultySignupFormModel.value.username?.includes(' '))
      this.invalidEmail = true;
    else
    this.invalidEmail = false;
  }

}
