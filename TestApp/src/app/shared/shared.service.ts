import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // dashboard paths
  ADMIN_PATH = '/dashboard-admin';
  FACULTY_PATH = '/dashboard-faculty';
  STUDENT_PATH = '/dashboard-student';
  
  status = [
    { active: 'Active', inactive: 'Inactive' }
  ];

  gender = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'},
  ];

  userType = [
    {value: 'admin', viewValue: 'Admin'},
    {value: 'faculty', viewValue: 'Faculty'},
    {value: 'student', viewValue: 'Student'},
  ];

  monthNames = [
    {value: 1, viewValue: 'January'},
    {value: 2, viewValue: 'February'},
    {value: 3, viewValue: 'March'},
    {value: 4, viewValue: 'April'},
    {value: 5, viewValue: 'May'},
    {value: 6, viewValue: 'June'},
    {value: 7, viewValue: 'July'},
    {value: 8, viewValue: 'August'},
    {value: 9, viewValue: 'September'},
    {value: 10, viewValue: 'October'},
    {value: 11, viewValue: 'November'},
    {value: 12, viewValue: 'December'}
  ];

  getMonthName(month: number): string {
    return this.monthNames.find(m => m.value === month)?.viewValue || '';
  }
  constructor() {}

}
