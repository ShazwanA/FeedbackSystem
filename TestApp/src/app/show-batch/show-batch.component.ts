import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AssignBatchComponent } from '../assign-batch/assign-batch.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertPopupComponent, ConfirmationPopupComponent, DetailsAlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-show-batch',
  templateUrl: './show-batch.component.html',
  styleUrls: ['./show-batch.component.css']
})
export class ShowBatchComponent implements OnInit {

  allstudents: any;
  filterData = "";
  allSubjects: any;
  allCourses: any;
  allDepartments: any;
  userRole: any;
  statusFilter: string = '';
   
  dataSource!: MatTableDataSource<any>;
  // dataClass!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private services:ServicesService,
    private dialog: MatDialog,
    private router: Router,
    public sharedService: SharedService,
    ) {
      this.userRole = this.services.getRole();

    this.services.allBatches().subscribe({
      next:(data: any)=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      }
    });
  }
  displayedColumns: string[] = [
    'batch_code',
    'faculty_name',
    'faculty_username',
    'batch_time',
    'department',
    'course',
    'subject',
    'is_active',
    'action'
  ];
  
  ngOnInit(): void {
  }


  applyFilter() {
    // console.log(this.filterData)
    // this.services.searchBatch({data:this.filterData}).subscribe({
    //   next:(data: any)=>{        
    //     this.dataSource = new MatTableDataSource(data);
    //     this.dataSource.paginator = this.paginator; 
    //   }  
    // })

    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
     const filter = {
    status: this.statusFilter || ''
  };

  this.dataSource.filter = JSON.stringify(filter);

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
  }

  editBatchDetails(row: any){
    this.dialog.open(AssignBatchComponent, {
      width: '40%',
      height: '70%',
      data: row
    });
  }

  deleteBatchDetails(batch_code: string){
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      data: {
        title: "Delete",
        message: 'Are You Sure Want to Delete?'
      }
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.services.deleteBatch(batch_code).subscribe({
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
  
  getCourseDetails(course_data:any){
      this.services.allCourses(true).subscribe({
        next: (response) => {
        this.allCourses = response;
        
        let course_name = '';
        for (let course = 0; course < this.allCourses.length; course++) {
          // Access each course like this.allCourses[course]\
          if(this.allCourses[course]['course_code']==course_data['course'])
          {
            course_name = this.allCourses[course]['course_name']
            this.allCourses[course]['is_active'] = this.sharedService.status[0][this.allCourses[course]['is_active']?'active':'inactive']
            this.detailsAlertPopup('Course Details', this.allCourses[course]);
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

    getSubjectDetails(subject_data:any){
      this.services.displayAllSubjects(true).subscribe({
        next: (response) => {
        this.allSubjects = response       

        let subject_name = '';
        for (let subject = 0; subject < this.allSubjects.length; subject++) {
          // Access each course like this.allCourses[course]\
          if(this.allSubjects[subject]['subject_code']==subject_data['subject'])
          {
            subject_name = this.allSubjects[subject]['subject_name']
            this.allSubjects[subject]['is_active'] = this.sharedService.status[0][this.allSubjects[subject]['is_active']?'active':'inactive']
            this.detailsAlertPopup('Subject Details', this.allSubjects[subject]);
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

  confirmationPopup(title='', message=''){
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '600px',
      data: {
        title: title,
        message: message
      }
    });
  }
  
}
