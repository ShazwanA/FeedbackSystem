import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { AddSubjectComponent } from '../add-subject/add-subject.component';
import { SharedService } from '../shared/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-subject',
  templateUrl: './show-subject.component.html',
  styleUrls: ['./show-subject.component.css']
})
export class ShowSubjectComponent implements OnInit {

  filterData = "";
  dataSource!: MatTableDataSource<any>;
  isAdmin = false;
  allCategory: any;
  userRole: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private services:ServicesService,
    private dialog: MatDialog,
    public status: SharedService,
    private router: Router,
    ) {
    this.userRole = services.getRole();

    this.services.displayAllSubjects().subscribe({
      next:(data: any)=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    });
  }
  displayedColumns: string[] = [
    'subject_name',
    'subject_code',
    'category',
    'subject_status',
    'action'
  ];
  
  ngOnInit(): void { }

  getCategoryDetails(subject_data:any){
      this.services.allCategory().subscribe({
        next: (response) => {
          this.allCategory = response;
          let category_name = '';
          for (let category = 0; category < this.allCategory.length; category++) {
            // Access each course like this.allCourses[course]\
            if(this.allCategory[category]['category_code']==subject_data['category'])
            {
              category_name = this.allCategory[category]['category_name']
              this.alertPopup('Category Details', category_name);
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
    alert("search is not active")
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

  editSubjectDetails(row: any){
    this.dialog.open(AddSubjectComponent, {
      width: '40%',
      height: '70%',
      data: row
    })
  }

  deleteSubjectDetails(subjectcode: string, subjectname: string){
    if(confirm("Are you sure want to delete subject  '"+subjectname+"'")){
      this.services.deleteSubject(subjectcode).subscribe({
        next:(data)=>{
          alert("Record deleted successfully")
          location.reload();
        },  
        error:()=>{
          alert("Error while deleting");
        }    
      })
    }
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
