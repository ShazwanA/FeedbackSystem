import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ServicesService } from '../services/services.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  submitBtn: string = "Add";
  isReadOnly = false;
  dataBeforeUpdate: string = ""
  isStaff = false

  constructor(
    private router: Router,
    private formbuild: FormBuilder,
    private services: ServicesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) { }

  addCategoryModel = this.formbuild.group({
    category_name: ['', Validators.required],
    category_code: ['', Validators.required],
    is_active: [false]
  }
  )

  ngOnInit(): void {
    if(this.editData){
      this.submitBtn = "Update";
      this.isReadOnly = true;
      this.addCategoryModel.controls['category_code'].setValue(this.editData.category_code);
      this.addCategoryModel.controls['category_name'].setValue(this.editData.category_name);
      this.addCategoryModel.controls['is_active'].setValue(this.editData.is_active);
      this.dataBeforeUpdate = this.editData.category_name
    }
    if(this.services.getRole() == 'admin' || this.services.getRole() == 'faculty')
        this.isStaff = true;
    if (this.isReadOnly)
      this.addCategoryModel.get('category_code')?.disable();
    else
      this.addCategoryModel.get('category_code')?.enable();
  }

  proceed(){
    if(!this.editData){
      this.addCategory();
    }
    else if(this.editData){
      this.updateCategoryDetails();
    }
  }

  addCategory(){
    this.services.addCategory(this.addCategoryModel.value).subscribe({
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

  updateCategoryDetails(){
    this.services.updateCategory(this.addCategoryModel.getRawValue()).subscribe({
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
