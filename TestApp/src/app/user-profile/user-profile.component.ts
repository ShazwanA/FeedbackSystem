import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  username: any = false;

  userProfileData ={
    first_name:'',
    last_name:'',
    username:'',
    user_type:'',
    gender:'',
    date_of_birth:'',
    joining_date:'',
    qualification:'',
    experience:'',
    father_name:'',
    roll_no:'',
    department:'',
    course_name:'',
    is_active:false,
    work_status:'',
    }

  constructor(
    private services: ServicesService,
    public userStatus: SharedService,
  ) { }

  ngOnInit(): void {   
    this.username = localStorage.getItem('username');

    this.services.getUserProfile(this.username).subscribe((response) =>{
      this.userProfileData.first_name = response.first_name
      this.userProfileData.last_name = response.last_name
      this.userProfileData.username = response.username
      this.userProfileData.gender = response.gender
      this.userProfileData.date_of_birth = response.date_of_birth
      this.userProfileData.joining_date = response.joining_date
      this.userProfileData.qualification = response.qualification
      this.userProfileData.experience = response.experience
      this.userProfileData.father_name = response.father_name
      this.userProfileData.roll_no = response.roll_no
      this.userProfileData.department = response.department
      this.userProfileData.course_name = response.course_name
      this.userProfileData.is_active = response.is_active
      this.userProfileData.user_type = response.user_type
      this.userProfileData.work_status = response.status
      
      }
    )
  }

}
