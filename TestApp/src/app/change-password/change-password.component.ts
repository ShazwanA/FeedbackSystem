import { Component, Inject, OnInit } from '@angular/core';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ServicesService } from '../services/services.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    isReadOnly = false;
    // dataBeforeUpdate: string = ""
    isStaff = false
    showHideOldPassword = true;
    showHideNewPassword = true;
    showHideConfirmPassword = true;
    responseMsg: any;
    allUserData: any;
    userRole: any;
    requestType = false;
  
    constructor(
      private router: Router,
      private formbuild: FormBuilder,
      private services: ServicesService,
      private dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public editData: any
    ) { 
      this.services.displayAllUsername().subscribe({
        next: (response) => {
        this.allUserData = response
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

      if(this.editData['requestType'] === 'changePassword')
        this.requestType = true;
      else
        this.requestType = false;
      
    }
  
    ngOnInit(): void {
      this.userRole = this.services.getRole();
      
      if(this.services.getRole() == 'admin' || this.services.getRole() == 'faculty')
          this.isStaff = true;
    }

  changePasswordModel = this.formbuild.group({
  old_password: ['', this.editData['requestType'] === 'changePassword'?[Validators.required]:[]],
  new_password: ['', Validators.required],
  confirm_password: ['', Validators.required],
  user: ['', !(this.editData['requestType'] === 'changePassword')?[Validators.required]:[]],
  })
  
    proceed(){
      if(this.changePasswordModel.value.new_password!=this.changePasswordModel.value.confirm_password)
      {
        this.responseMsg = "Password confirmation does not match";
        return;
      }      
        const methodName = this.editData['requestType'] as keyof ServicesService;
        (this.services[methodName] as Function)(this.changePasswordModel.value).subscribe({
          next:(data: any)=>{
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

      // else if(this.editData.data.user_type == 'self'){
      //   this.services.changePassword(this.changePasswordModel.value).subscribe({
      //     next:(data)=>{
      //       this.dialog.closeAll()
      //       this.alertPopup('Success', data);
      //       const currentUrl = this.router.url;
      //       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //       this.router.navigate([currentUrl]);
      //     });
      //   },
      //     error: (error: HttpErrorResponse) => {
      //       if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
      //         this.services.logout();
      //         this.alertPopup('Error', 'Session is expired. Please Login')
      //       }
      //       else{
      //         this.alertPopup('Error', error.error)
      //       }
      //     }
      //   });
      // }
  
      // else{
      //   this.updateCategoryDetails();
      // }
    }
  
    // updateCategoryDetails(){
    //   this.services.updateCategory(this.changePasswordModel.getRawValue()).subscribe({
    //       next:(data)=>{
    //         this.dialog.closeAll()
    //         this.alertPopup('Success', data);
    //         const currentUrl = this.router.url;
    //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //         this.router.navigate([currentUrl]);
    //       });
    //     },
    //       error: (error: HttpErrorResponse) => {
    //         if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
    //           this.services.logout();
    //           this.alertPopup('Error', 'Session is expired. Please Login')
    //         }
    //         else{
    //           this.alertPopup('Error', error.error)
    //         }
    //       }
    //     });
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
