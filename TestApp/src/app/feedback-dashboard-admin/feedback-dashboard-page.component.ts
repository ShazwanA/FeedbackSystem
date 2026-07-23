import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertPopupComponent, ConfirmationPopupComponent, DetailsAlertPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AssignBatchComponent } from '../assign-batch/assign-batch.component';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DashboardCard } from '../models/dashboard.model';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-feedback-dashboard-page',
  templateUrl: './feedback-dashboard-page.component.html',
  styleUrls: ['./feedback-dashboard-page.component.css']
})
export class FeedbackDashboardPageComponent implements OnInit {

  // cards: any[] = []
  dashboardData:any = {};
  topFaculty: any[] = [];
  recentFeedback: any[] = [];
  feedbackTrend: any[] = [];
  departmentPerformance: any[] = [];
  todaySummary: any = {};
  feedbackDistribution: any[] = [];

  summaryError = false;

  // cards:any[]=[];
  // departmentPerformance:any[]=[];
  // feedbackTrend:any[]=[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private services:ServicesService,
    private dialog: MatDialog,
    public sharedService: SharedService,
    ) { 
      this.getAdminDashboardData();
    }
    
  
  ngOnInit(): void { }

// dashboard: DashboardCard = {} as DashboardCard;

getAdminDashboardData() {

  this.services.getDashboardCards().subscribe({
    next: (response) => {
      this.dashboardData = response.data;
      this.topFaculty = response.data.top_faculty;
      this.recentFeedback = response.data.recent_feedback;
      this.feedbackTrend = response.data.charts.feedback_trend;
      this.departmentPerformance = response.data.charts.department_performance;
      this.todaySummary = response.data.today_summary;
      this.feedbackDistribution = response.data.charts.feedback_distribution;

      this.summaryError = false; //handle error state for summary
    },
    error: (error) => {
        this.summaryError = true; //handle error state for summary
        if(error.status==401){
          this.services.logout();
          this.dialog.closeAll();
          this.alertPopup('Error', 'Session is expired. Please Login')
        }
        // else{
        //   this.alertPopup('Error', error.error)
        // }
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

//   detailsAlertPopup(title='', message=''){
//     const dialogRef = this.dialog.open(DetailsAlertPopupComponent, {
//       width: '600px',
//       data: {
//         title: title,
//         message: message
//       }
//     });
//   }

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


// this.cards = [

//   {
//     title:'Faculty',
//     value:this.dashboard.total_faculty,
//     icon:'groups',
//     color:'#1976d2',
//     subtitle:'Registered Faculty'
//   },

//   {
//     title:'Students',
//     value:this.dashboard.total_students,
//     icon:'school',
//     color:'#43a047',
//     subtitle:'Registered Students'
//   },

//   {
//     title:'Batches',
//     value:this.dashboard.total_batches,
//     icon:'menu_book',
//     color:'#fb8c00',
//     subtitle:'Total Batches'
//   },

//   {
//     title:'Feedback',
//     value:this.dashboard.total_feedback,
//     icon:'rate_review',
//     color:'#8e24aa',
//     subtitle:'Feedback Submitted'
//   },

//   {
//     title:'Departments',
//     value:this.dashboard.total_departments,
//     icon:'business',
//     color:'#3949ab',
//     subtitle:'Departments'
//   },

//   {
//     title:'Courses',
//     value:this.dashboard.total_courses,
//     icon:'library_books',
//     color:'#00897b',
//     subtitle:'Courses'
//   },

//   {
//     title:'Subjects',
//     value:this.dashboard.total_subjects,
//     icon:'book',
//     color:'#e53935',
//     subtitle:'Subjects'
//   },

//   {
//     title:'Avg Rating',
//     value:this.dashboard.average_rating,
//     icon:'star',
//     color:'#fbc02d',
//     subtitle:'Overall Rating'
//   }

// ];
