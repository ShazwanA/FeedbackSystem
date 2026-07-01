import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ServicesService } from '../services/services.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})
export class AddSubjectComponent implements OnInit {
  updateBtn: string = "Add";
  isReadOnly = false;
  allCategory : any;
  submitBtn = 'Add';
  isStaff = false

  constructor(
    private formbuild: FormBuilder,
    private services: ServicesService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) { 
      this.services.allCategory(true).subscribe((data)=>{
        this.allCategory = data;
      });
      
      
    }

    addSubjectModel = this.formbuild.group({
      subject_name: ['', Validators.required],
      subject_code: ['', Validators.required],
      category: [, Validators.required],
      is_active: [false],
  }
  )

  ngOnInit(): void {
    if(this.editData){
      console.log(this.editData.category);
      
      this.updateBtn = "Update";
      this.isReadOnly = true;
      this.addSubjectModel.controls['subject_name'].setValue(this.editData.subject_name);
      this.addSubjectModel.controls['subject_code'].setValue(this.editData.subject_code);
      this.addSubjectModel.controls['category'].setValue(this.editData.category);
      this.addSubjectModel.controls['is_active'].setValue(this.editData.is_active);
    }
    if(this.services.getRole() == 'admin' || this.services.getRole() == 'faculty')
      this.isStaff = true;
    if (this.isReadOnly)
      this.addSubjectModel.get('subject_code')?.disable();
    else
      this.addSubjectModel.get('subject_code')?.enable();
  }

  proceed(){
    if(this.editData)
      this.updateSubjectDetails();
    else if(!this.editData)
      this.addSubject()
  }

  addSubject(){
    this.services.addSubject(this.addSubjectModel.value).subscribe({
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

  updateSubjectDetails(){
    this.services.updateSubject(this.addSubjectModel.getRawValue()).subscribe({
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
