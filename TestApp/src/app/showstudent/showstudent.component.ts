import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { AlertPopupComponent, ConfirmationPopupComponent, DetailsAlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-showstudent',
  templateUrl: './showstudent.component.html',
  styleUrls: ['./showstudent.component.css']
})
export class ShowstudentComponent implements OnInit {
  allstudents: any;
  filterData = "";
  allCourses: any;
  allDepartments: any;
   
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private services:ServicesService,
    private dialog: MatDialog,
    public userStatus: SharedService,
    ) { 

    this.services.displayAllStudent().subscribe({
      next:(data: any)=>{
        
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    });
  }
  displayedColumns: string[] = [
    'first_name', 
    // 'last_name', 
    'username', 
    'gender', 
    'father_name', 
    'roll_no', 
    'date_of_birth', 
    'course', 
    'department',
    'user_type',
    'user_status',
    'work_status',
    'action'
  ];
  
  ngOnInit(): void {
  }

  getCourseDetails(course_data:any){
    this.services.allCourses().subscribe({
      next: (response) => {
      this.allCourses = response;
      
      let course_name = '';
      for (let course = 0; course < this.allCourses.length; course++) {
        // Access each course like this.allCourses[course]\
        if(this.allCourses[course]['course_code']==course_data['course'])
        {
          course_name = this.allCourses[course]['course_name']
          this.allCourses[course]['is_active'] = this.userStatus.status[0][this.allCourses[course]['is_active']?'active':'inactive']
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
    this.services.allDepartments().subscribe({
        next: (response) => {
        this.allDepartments = response

        let department_name = '';
      for (let department = 0; department < this.allDepartments.length; department++) {
        // Access each course like this.allCourses[course]\
        if(this.allDepartments[department]['department_code']==department_data['department'])
        {
          department_name = this.allDepartments[department]['department_name']
          this.allDepartments[department]['is_active'] = this.userStatus.status[0][this.allDepartments[department]['is_active']?'active':'inactive']
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


  applyFilter() {
    // console.log(this.filterData)
    this.services.searchStudent({data:this.filterData}).subscribe({
      next:(data: any)=>{
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        
      }  
    })

    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  editStudentDetails(row: any){
    this.dialog.open(SignupComponent, {
      width: '40%',
      height: '70%',
      data: {row:row, requestType:'Update', message:'Update User'}
    })
  }

  deleteStudentDetails(username: any){
      this.services.deleteStudent(username).subscribe({
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
          this.deleteStudentDetails(username);
        else
          console.log('Not a Valid Operation');
          
      } else {
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
