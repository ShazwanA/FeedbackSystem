import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../services/services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '../services/shared.service';
import { AddFeedbackQuestionComponent } from '../add-feedback-question/add-feedback-question.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent, ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-all-feedback-questions',
  templateUrl: './show-all-feedback-questions.component.html',
  styleUrls: ['./show-all-feedback-questions.component.css']
})
export class ShowAllFeedbackQuestionsComponent implements OnInit {
  filterData: any;
  statusFilter: string = '';
  userRole:any
  dataSource!: MatTableDataSource<any>;

   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private services: ServicesService,
    public userStatus: SharedService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.services.allFeedbackQuestions().subscribe({
       next:(data: any)=>{
       this.dataSource = new MatTableDataSource(data);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
       
       this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
    const search = JSON.parse(filter);

    // Status Search
    const statusMatch = search.status === '' || data.is_active.toString() === search.status;

    return statusMatch;
  };
     },
     error: (error: HttpErrorResponse) => {
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
            this.services.logout();
            this.alertPopup('Error', 'Session is expired. Please Login')
          }
          else{
            this.alertPopup('Error', error.error)
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
            });
          }
        }
     });
     this.userRole = services.getRole();
   }

   displayedColumns: string[] = [
     'question',
     'option_a',
     'option_b',
     'option_c',
     'option_d',
     'status',
     'action'
   ];

  ngOnInit(){ }

  applyFilter() {

  const filter = {
    status: this.statusFilter || ''
  };

  this.dataSource.filter = JSON.stringify(filter);

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

  editQuestion(questionData:any){
    this.dialog.open(AddFeedbackQuestionComponent, {
          width: '40%',
          height: '70%',
          data: questionData
        });
  }

  deleteQuestion(question_id:any, title:any, message:any){
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '400px',
        data: {
          title: "Delete",
          message: 'Are You Sure Want to Delete?'
        }
      });
   
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.services.deleteFeedbackQuestion(question_id).subscribe({
            next:(data)=>{
            this.alertPopup('Delete', data);
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
              const currentUrl = this.router.url;
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
              });
            }
          }
          });
            
        }
        else {
          // User clicked No or closed the dialog
          console.log('Aborted');
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
