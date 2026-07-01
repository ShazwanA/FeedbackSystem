import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { SharedService } from '../services/shared.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCourseComponent } from '../add-course/add-course.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertPopupComponent, ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-show-category',
  templateUrl: './show-category.component.html',
  styleUrls: ['./show-category.component.css']
})
export class ShowCategoryComponent implements OnInit {
  allstudents: any;
  filterData = "";
  dataSource!: MatTableDataSource<any>;
  isAdmin = false;
  userRole: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: Router,
    public userStatus: SharedService,
    private services:ServicesService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.userRole = services.getRole();

    this.services.allCategory().subscribe({
      next:(data: any)=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      error: (error: HttpErrorResponse) => {
        console.log('Error status code:', error.status);     // ❌ For failed responses (e.g., 400, 500)
        console.log('Error body:', error.error);
        if(error.status==401 && error.error['detail'] === 'Given token not valid for any token type'){
          localStorage.clear()
          this.route.navigate([''])
        }
      }
    });
  }

  ngOnInit(): void { }
  
  displayedColumns: string[] = [
    'category_name',
    'category_code',
    'category_status',
    'action'
  ];

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

  editCategoryDetails(row: any){
    this.dialog.open(AddCategoryComponent, {
      width: '30%',
      height: '70%',
      data: row
    })
  }

  deleteCategory(category_code: string, title: string, message:string){
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
            this.services.deleteCategory(category_code).subscribe({
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
