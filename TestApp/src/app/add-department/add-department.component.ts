import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ServicesService } from '../services/services.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {
  submitButton: string = "Add";
  isReadOnly = false;
  isStaff = false

  constructor(
    private router: Router,
    private formbuild: FormBuilder,
    private services: ServicesService,
    // private alertPopup: AlertPopupComponent,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) { }

    addDepartmentModel = this.formbuild.group({
      department_name: ['', Validators.required],
      department_code: ['', Validators.required],
      is_active: [false]
  }
  )

  ngOnInit(): void {
    if(this.editData){
      this.submitButton = "Update";
      this.isReadOnly = true;
      this.addDepartmentModel.controls['department_name'].setValue(this.editData.department_name);
      this.addDepartmentModel.controls['department_code'].setValue(this.editData.department_code);
       this.addDepartmentModel.controls['is_active'].setValue(this.editData.is_active);
    }
    if(this.services.getRole() == 'admin' || this.services.getRole() == 'faculty')
        this.isStaff = true;

    // if (this.isReadOnly)
    //   this.addDepartmentModel.get('department_code')?.disable();
    // else
    //   this.addDepartmentModel.get('department_code')?.enable();
  }

  addDepartment(){
    if(!this.editData){

    //add new class
      if(!(this.addDepartmentModel.value.department_name && this.addDepartmentModel.value.department_code))
      {
        return;
      }

      this.services.addDepartment(this.addDepartmentModel.value).subscribe({
        next: (response: HttpResponse<any>) => {
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
      );
    }
    else
      this.updateDepartmentDetails();
  }

  updateDepartmentDetails(){
    console.log(this.addDepartment);
    
    this.services.updateDepartment(this.addDepartmentModel.getRawValue()).subscribe({
        next: (response: HttpResponse<any>) => {
          // alert(response)
          this.dialog.closeAll();
          this.alertMessage('Success', response);
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
  });
          
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

