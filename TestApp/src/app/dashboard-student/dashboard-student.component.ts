import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styleUrls: ['./dashboard-student.component.css']
})
export class DashboardStudentComponent implements OnInit {

  fullNameOfUser: any;
  constructor(
    private route: Router,
    private service: ServicesService,
    private dialog: MatDialog,
    ) { }

  logout(){
    this.service.logout();
  }

  ngOnInit(): void {
    this.fullNameOfUser = localStorage.getItem('firstname')+" "+localStorage.getItem('lastname')
  }

  // changePassword() {
  //   this.dialog.open(ChangePasswordComponent, {
  //     width: '30%',
  //     height: '70%',
  //   });
  // }

}
