import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ServicesService } from '../services/services.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-add-feedback-question',
  templateUrl: './add-feedback-question.component.html',
  styleUrls: ['./add-feedback-question.component.css']
})
export class AddFeedbackQuestionComponent implements OnInit {

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
  
  addQuestionModel = this.formbuild.group({
    question: ['', Validators.required],
    option_a: ['', Validators.required],
    option_b: ['', Validators.required],
    option_c: ['', Validators.required],
    option_d: ['', Validators.required],
    option_e: ['', Validators.required],
    is_active: [false]
  }
  ) as FormGroup;

  ngOnInit(): void {
    if(this.editData){     
      this.submitBtn = "Update";
      this.isReadOnly = true;
      this.addQuestionModel.controls['question'].setValue(this.editData.question);
      this.addQuestionModel.controls['option_a'].setValue(this.editData.option_a);
      this.addQuestionModel.controls['option_b'].setValue(this.editData.option_b);
      this.addQuestionModel.controls['option_c'].setValue(this.editData.option_c);
      this.addQuestionModel.controls['option_d'].setValue(this.editData.option_d);
      this.addQuestionModel.controls['option_e'].setValue(this.editData.option_e);
      this.addQuestionModel.controls['is_active'].setValue(this.editData.is_active);
      this.addQuestionModel.addControl('id', new FormControl(this.editData.id, Validators.required));
    }
    if(this.services.getRole() == 'admin' || this.services.getRole() == 'faculty')
        this.isStaff = true;
  }

  proceed(){
    if(!this.editData){
      this.addQuestion();
    }
    else if(this.editData){
      this.updateQuestionDetails();
    }
  }

  addQuestion(){
      this.services.addQuestion(this.addQuestionModel.value).subscribe({
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

  updateQuestionDetails(){   
    this.services.updateFeedbackQuestions(this.addQuestionModel.getRawValue()).subscribe({
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
