import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicesService } from '../services/services.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-assign-batch',
  templateUrl: './assign-batch.component.html',
  styleUrls: ['./assign-batch.component.css']
})
export class AssignBatchComponent implements OnInit {

  submitBtn: string = "Assign";
  isReadOnly = false;
  facultyData:any;
  facultyFullName:any;
  allDepartments: any;
  allSubjects: any;
  allCourses: any;
  isStaff: any;

  constructor(
    private formbuild: FormBuilder,
    private services: ServicesService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) { 
        this.services.displayFacultyUsername().subscribe({
          next: (response) => {
          this.facultyData = response
          // console.log(this.facultyData);
          
          },
          error: (error: HttpErrorResponse) => {
            if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
              this.dialog.closeAll();
              this.services.logout();
              this.alertPopup('Error', 'Session is expired. Please Login');
            }
            else{
              this.alertPopup('Error Raised', error.error)
              const currentUrl = this.router.url;
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
              });
            }
          }
        });

      this.services.allCourses(true).subscribe({
        next: (response) => {
        this.allCourses = response
        },
        error: (error: HttpErrorResponse) => {
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
            this.dialog.closeAll();
            this.services.logout();
            this.alertPopup('Error', 'Session is expired. Please Login');
          }
          else{
            this.alertPopup('Error Raised', error.error)
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
            });
          }
        }
      });

      this.services.displayAllSubjects(true).subscribe({
        next: (response) => {
        this.allSubjects = response
        },
        error: (error: HttpErrorResponse) => {
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
            this.dialog.closeAll();
            this.services.logout();
            this.alertPopup('Error', 'Session is expired. Please Login');
          }
          else{
            this.alertPopup('Error Raised', error.error)
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
            this.dialog.closeAll();
            this.services.logout();
            this.alertPopup('Error', 'Session is expired. Please Login');
          }
          else{
            this.alertPopup('Error Raised', error.error)
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
            });
          }
        }
      });
    }

    assignBatchModel = this.formbuild.group({
      batch_code: ['',
        [Validators.required,
         Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Z0-9]+$/),
         Validators.maxLength(10)]],
      faculty_full_name: [],
      faculty: [],
      department: [],
      course: [],
      subject: [],
      batch_time: [],
      is_active: [false]
    }
  )

  ngOnInit(): void {
    if(this.editData){
      this.submitBtn = "Update";
      this.isReadOnly = true;
      this.assignBatchModel.controls['batch_code'].setValue(this.editData.batch_code);
      this.assignBatchModel.controls['department'].setValue(this.editData.department);
      this.assignBatchModel.controls['subject'].setValue(this.editData.subject);
      this.assignBatchModel.controls['course'].setValue(this.editData.course);
      this.assignBatchModel.controls['faculty_full_name'].setValue(this.editData.faculty_full_name);
      this.assignBatchModel.controls['faculty'].setValue(this.editData.faculty);
      this.assignBatchModel.controls['batch_time'].setValue(this.editData.batch_time);
      this.assignBatchModel.controls['is_active'].setValue(this.editData.is_active);
    }
    if(this.services.getRole() == 'admin')
      this.isStaff = true;
    if (this.isReadOnly)
      this.assignBatchModel.get('batch_code')?.disable();
    else
      this.assignBatchModel.get('batch_code')?.enable();
  }

  getFacultyFullName(event: MatSelectChange){
    for(let user=0; user<this.facultyData.length; user++)
    {      
      if(this.assignBatchModel.controls['faculty'].value === this.facultyData[user]['username'])
      {        
        this.facultyFullName = this.facultyData[user]['first_name']+
        ' '+(this.facultyData[user]['last_name']?this.facultyData[user]['last_name']:'');
      }
    }
  }

  proceed(){
    if(!this.editData){
      this.assignBatch();
    }
    else if(this.editData){
      this.updateBatchDetails();
    }
  }

  assignBatch(){
    this.assignBatchModel.get('faculty_full_name')?.setValue(this.facultyFullName);    
    this.services.assignNewBatch(this.assignBatchModel.value).subscribe({
      next: (response) => {
        this.dialog.closeAll()
        this.alertPopup('Success', response);
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
        });
      },
      error: (error: HttpErrorResponse) => {
        if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
          this.dialog.closeAll();
          this.services.logout();
          this.alertPopup('Error', 'Session is expired. Please Login');
        }
        else{
          this.alertPopup('Error Raised', error.error)
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
          });
        }
      }
    });
  }

  updateBatchDetails(){
    this.services.updateBatch(this.assignBatchModel.getRawValue()).subscribe({
      next: (response) => {
        this.dialog.closeAll()
        this.alertPopup('Success', response);
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    },
      error: (error: HttpErrorResponse) => {
        if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
          this.dialog.closeAll();
          this.services.logout();
          this.alertPopup('Error', 'Session is expired. Please Login');
        }
        else{
          this.alertPopup('Error Raised', error.error)
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
          });
        }
      }
    });
  }

  alertPopup(title='', message=''){
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        width: '400px',
        data: {
          title: title,
          message: message
        }
      });
    }

}
