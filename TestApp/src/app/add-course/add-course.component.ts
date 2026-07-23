import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ServicesService } from '../services/services.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  submitBtn: string = "Add";
  isReadOnly = false;
  isStaff = false;
  
  constructor(
    private router: Router,
    private formbuild: FormBuilder,
    private services: ServicesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) { }
  
  addCourseModel = this.formbuild.group({
    course_name: ['', Validators.required],
    course_code: ['', Validators.required],
    is_active: [false],
    }
    )
  
  ngOnInit(): void {
    if(this.editData){
      this.submitBtn = "Update";
      this.isReadOnly = true;
      this.addCourseModel.controls['course_name'].setValue(this.editData.course_name);
      this.addCourseModel.controls['course_code'].setValue(this.editData.course_code);
      this.addCourseModel.controls['is_active'].setValue(this.editData.is_active);
    }
    if(this.services.getRole() == 'admin' || this.services.getRole() == 'faculty')
      this.isStaff = true;
    if (this.isReadOnly)
      this.addCourseModel.get('course_code')?.disable();
    else
      this.addCourseModel.get('course_code')?.enable();
  }

  proceed(){
    if(!this.editData){
      this.addCourse();
    }
    else if(this.editData){
      this.updateCourseDetails();
    }
  }
  
  addCourse(){
    if(!this.editData){

    //add new class
      if(!(this.addCourseModel.value.course_name && this.addCourseModel.value.course_code))
      {
        alert("all fields required");
        return;
      }

      this.services.addCourse(this.addCourseModel.value).subscribe({
        next: (response: HttpResponse<any>) => {
          this.dialog.closeAll();
          this.alertMessage('Success', response)
        },
        error: (error: HttpErrorResponse) => {
          console.log('Error status code:', error.status);     // ❌ For failed responses (e.g., 400, 500)
          console.log('Error body:', error.error);
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type')
            this.services.logout();
        }
      }
      )
    }

    else{
      this.updateCourseDetails();
    }
  }
  
  updateCourseDetails(){
    this.services.updateCourse(this.addCourseModel.getRawValue()).subscribe({
      next: (response: HttpResponse<any>) => {
        // alert(response)
        this.dialog.closeAll();
        this.alertMessage('Success', response);        
      },
      error: (error: HttpErrorResponse) => {
        if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
          this.services.logout();
          this.alertMessage('Error', 'Session is expired. Please Login')
        }
        else
          this.alertMessage('Error', error.error)
      }
    }
    )
  }
  alertMessage(title: any, message: any){
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        width: '400px',
        data: {
          title: title,
          message: message
        }
      });
    }
}
