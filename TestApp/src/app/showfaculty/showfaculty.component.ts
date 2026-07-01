import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FacultySignupComponent } from '../faculty-signup/faculty-signup.component';
import { ServicesService } from '../services/services.service';
import { SharedService } from '../services/shared.service';
import { SignupComponent } from '../signup/signup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent, ConfirmationPopupComponent, DetailsAlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-showfaculty',
  templateUrl: './showfaculty.component.html',
  styleUrls: ['./showfaculty.component.css']
})
export class ShowfacultyComponent implements OnInit {
  allfaculty: any;
  allDepartments:any;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private services:ServicesService,
    private dialog: MatDialog,
    public sharedService: SharedService,
    private router: Router
    ) { 
    this.services.displayAllFaculty().subscribe({
      next:(data: any)=>{
      this.allfaculty = new MatTableDataSource(data);
      this.allfaculty.paginator = this.paginator;
      this.allfaculty.sort = this.sort;
      console.log(this.allfaculty)
    }
  });
  }
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'username',
    'gender',
    'date_of_birth',
    'department',
    'joining_date',
    'qualification',
    'experience',
    'user_type',
    'status',
    'user_status',
    'action'
  ];
  ngOnInit(): void { }

  getDepartmentDetails(department_data:any){
    this.services.allDepartments().subscribe({
        next: (response) => {
        this.allDepartments = response

        let department_name = '';
      for (let department = 0; department < this.allDepartments.length; department++) {
        // Access each course like this.allCourses[course]\
        if(this.allDepartments[department]['department_code']==department_data['department'])
        {
          department_name = this.allDepartments[department]['department_name']
          this.allDepartments[department]['is_active'] = this.sharedService.status[0][this.allDepartments[department]['is_active']?'active':'inactive']
          this.detailsAlertPopup('Department Details', this.allDepartments[department]);
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
    this.dialog.open(SignupComponent, {
      width: '40%',
      height: '70%',
      data: {row:row, requestType:'Update', message:'Update User'}
    })
  }

  deleteFacultyDetails(username: string, title:any, message:any){
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
            this.services.deleteFaculty(username).subscribe({
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
          else {
            // User clicked No or closed the dialog
            console.log('Aborted');
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

  detailsAlertPopup(title='', message=''){
      const dialogRef = this.dialog.open(DetailsAlertPopupComponent, {
        width: '600px',
        data: {
          title: title,
          message: message
        }
      });
    }
}