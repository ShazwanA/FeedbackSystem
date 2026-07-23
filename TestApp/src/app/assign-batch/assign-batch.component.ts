import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicesService } from '../services/services.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { SharedService } from '../shared/shared.service';

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
  allMonths: any = [];
  currentYear: any = [new Date().getFullYear(), new Date().getFullYear()+1];

  constructor(
    private formbuild: FormBuilder,
    private services: ServicesService,
    private dialog: MatDialog,
    private router: Router,
    public sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) { 
      
        this.allMonths = sharedService.monthNames;

        this.services.getFacultyUsername().subscribe({
          next: (response) => {
          this.facultyData = response
          },
          error: (error) => {
            if(error.status==401){
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
          if(error.status==401){
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
          if(error.status==401){
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
          if(error.status==401){
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
    }       // constructor closed

    assignBatchModel = this.formbuild.group({
      batch_code: ['',
        [Validators.required,
         Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Z0-9]+$/),
         Validators.maxLength(10)]],
      faculty: ['', Validators.required],
      department: ['', Validators.required],
      course: ['', Validators.required],
      subject: ['', Validators.required],
      batch_time: ['', Validators.required],
      started_month: ['', Validators.required],
      year: ['', Validators.required],
      is_active: [false],
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
      this.assignBatchModel.controls['faculty'].setValue(this.editData.faculty);
      this.assignBatchModel.controls['batch_time'].setValue(this.editData.batch_time);
      this.assignBatchModel.controls['started_month'].setValue(this.editData.started_month);
      this.assignBatchModel.controls['year'].setValue(this.editData.year);
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
        if(error.status==401){
          this.dialog.closeAll();
          this.services.logout();
          this.alertPopup('Error', 'Session is expired. Please Login');
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
          });
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
      error: (error) => {
        if(error.status==401){
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
