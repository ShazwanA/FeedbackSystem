import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCourseComponent } from '../add-course/add-course.component';
import { SharedService } from '../shared/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent, ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-show-course',
  templateUrl: './show-course.component.html',
  styleUrls: ['./show-course.component.css']
})
export class ShowCourseComponent implements OnInit {

 allstudents: any;
   filterData = "";
   dataSource!: MatTableDataSource<any>;
   isAdmin = false;
   userRole: any;
 
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
 
   constructor(
     private services:ServicesService,
     private dialog: MatDialog,
     public userStatus: SharedService,
     private router: Router
     ) {
      this.userRole = services.getRole();
 
     this.services.allCourses().subscribe({
       next:(data: any)=>{
       this.dataSource = new MatTableDataSource(data);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
     }
     });
   }
   displayedColumns: string[] = [
     'course_name',
     'course_code',
     'course_status',
     'action'
   ];
   
   ngOnInit(): void {
   }
 
 
   applyFilter() {
     // console.log(this.filterData)
     // this.services.searchStudent({data:this.filterData}).subscribe({
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
   }
 
   editCourseDetails(row: any){
     this.dialog.open(AddCourseComponent, {
       width: '40%',
       height: '70%',
       data: row
     })
   }
 
   deleteCoursesDetails(course_code: string, title: string, message:string){
     const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '400px',
        data: {
          title: title,
          message: message
        }
      });
          
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // User clSicked Yes
          this.services.deleteCourse(course_code).subscribe({
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
}
