import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  status = [
    { active: 'Active', inactive: 'Inactive' }
  ];

  gender = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'},
  ];

  userType = [
    {value: 'faculty', viewValue: 'Faculty'},
    {value: 'student', viewValue: 'Student'},
    {value: 'admin',   viewValue: 'Admin'}
  ];
  constructor() {}
}
