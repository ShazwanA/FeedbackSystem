import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../services/services.service';
import { SignupComponent } from '../signup/signup.component';
import { SharedService } from '../services/shared.service';
import { AlertPopupComponent, ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-approve-newfaculty',
  templateUrl: './approve-newfaculty.component.html',
  styleUrls: ['./approve-newfaculty.component.css']
})
export class ApproveNewfacultyComponent implements OnInit {
  allfaculty: any;
  allDepartments:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private services:ServicesService,
    private dialog: MatDialog,
    public sharedService: SharedService,
    ) { 
    this.services.showApprovalRequestForFaculty().subscribe({
      next:(data: any)=>{
      this.allfaculty = new MatTableDataSource(data);
      this.allfaculty.paginator = this.paginator;
      this.allfaculty.sort = this.sort;
      // console.log(this.allfaculty)
    }
  });
  }
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'facul_username',
    'gender',
    'date_of_birth',
    'department',
    'joining_date',
    'qualification',
    'experience',
    'user_type',
    'is_active',
    'status',
    'action'
  ];
  ngOnInit(): void { }

  getDepartmentDetails(department_data:any){
    this.services.allDepartments(true).subscribe({
        next: (response) => {
        this.allDepartments = response

        let department_name = '';
      for (let department = 0; department < this.allDepartments.length; department++) {
        // Access each course like this.allCourses[course]\
        if(this.allDepartments[department]['department_code']==department_data['department'])
        {
          department_name = this.allDepartments[department]['department_name']
          this.alertPopup('Department Details', department_name);
          break;
        }
      }
      },
        error: (error: HttpErrorResponse) => {
          
          if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allfaculty.filter = filterValue.trim().toLowerCase();

    if (this.allfaculty.paginator) {
      this.allfaculty.paginator.firstPage();
    }
  }

  editFacultyDetails(row: any){
    console.log(row);
    
    this.dialog.open(SignupComponent, {
      width: '40%',
      height: '70%',
      data: {row:row, requestType:'Approve', message:'Approve Request'}
    })
  }

  deleteFacultyDetails(username: any){
    // alert(username);
      this.services.deleteFaculty(username).subscribe({
        next:(response)=>{
          // this.alertPopup('Success', response);
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

  approveFaculty(username: any){
     this.services.approveFaculty({username:username, is_active:1}).subscribe({
        next:(data)=>{
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
  proceed(taskType : string, title:string, message:string, username = null) {

    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      data: {
        title: title,
        message: message
      }
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked Yes
        if (taskType==='Delete')
          this.deleteFacultyDetails(username);
        else if (taskType === 'Approve')
          this.approveFaculty(username)
        else
          console.log('Not a Valid Operation');
          
      } else {
        // User clicked No or closed the dialog
        console.log('Aborted');
      }
    });
  }

  alertPopup(title:string='', message:string=''){
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        width: '400px',
        data: {
          title: title,
          message: message
        }
      });
    }

}