import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, window } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  isInvalid: boolean = false;
  roleAs: any;
  isLogin: any;
  fullName: any;
  invalidCredentials: any;

  // USERNAME: any;
  // USERTYPE: any;
  // STATE: any;

  constructor(
    private http: HttpClient,
    private route: Router,
    private matdailog: MatDialog,
    ) { }
  
    getRole() {
      this.roleAs = localStorage.getItem('usertype');
      return this.roleAs;
    }

    isSignedIn() {
      const loggedIn = localStorage.getItem('STATE');
      if (loggedIn == 'true')
        this.isLogin = true;
      else
        this.isLogin = false;
      return this.isLogin;
    }

  userLogin(username:any, userData: any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/login-user`, {username: username, userData});
  }

  getUserProfile(username:any){
    return this.http.get<any>(`${environment.BASE_URL}/Admin/user-profile`);
  }

  changePassword(passwordData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/change-password`, passwordData);
  }

  changePasswordByParent(passwordData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/change-password-by-parent`, passwordData);
  }

  logout(){
    this.http.get(`${environment.BASE_URL}/Admin/logout`).subscribe(result =>{
      console.log(result);
    })
    localStorage.clear()
    this.isLoggedIn.next(false);
    this.route.navigate([''])
  }

  displayAllStudent(){
    return this.http.get(`${environment.BASE_URL}/Student/show-all-student`);
  }

  updateStudent(studentData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Student/update-student-details`,{studentData});
  }

  searchStudent(studentData:any){
    return this.http.post(`${environment.BASE_URL}/Student/search-student`,studentData);
  }

  rejectNewStudentRequest(username:any){
    return this.http.post<any>(`${environment.BASE_URL}/Student/reject-new-student-request`, {username});
  }

  showApprovalRequestForStudent(){
    return this.http.get(`${environment.BASE_URL}/Student/show-to-approve-new-student`);
  }

  approveStudentRequest(approvalData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Student/approve-new-student-request`, {approvalData});
  }

  deleteStudent(username:any){
    return this.http.post<any>(`${environment.BASE_URL}/Student/delete-student`, username);
  }

  registerNewUser(userData: any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/add-user`,{userData});
  }

  updateFaculty(facultyData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Faculty/update-faculty-details`, {facultyData});
  }

  displayAllFaculty(){
    return this.http.get(`${environment.BASE_URL}/Faculty/show-all-faculty`);
  }

  getFacultyUsername(){
    return this.http.get(`${environment.BASE_URL}/Faculty/show-faculty-username`);
  }
  
  displayAllUsername(){
    return this.http.get(`${environment.BASE_URL}/Admin/all-user-names`);
  }

  deleteFaculty(username:any){
    return this.http.post<any>(`${environment.BASE_URL}/Faculty/delete-faculty`, username);
  }

  showApprovalRequestForFaculty(){
    return this.http.get(`${environment.BASE_URL}/Faculty/show-new-faculty-pending_requests`);
  }

  approveFaculty(approvalData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Faculty/approve-new-faculty-request`, {approvalData});
  }

  addCourse(courseData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/add-new-course`,courseData);
  }

  allCourses(is_active: boolean =false){
    const params = {
      is_active: is_active
    }
    return this.http.get(`${environment.BASE_URL}/Admin/show-all-courses`, {params});
  }

  updateCourse(courseData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/update-course`, courseData);
  }

  deleteCourse(course_code:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/delete-course`, {course_code});
  }

  displayAllSubjects(is_active: boolean =false){
    const params = {
      is_active: is_active
    }
    return this.http.get(`${environment.BASE_URL}/Admin/show-all-subjects`, {params});
  }

  addSubject(SubjectData:any){
    return this.http.post(`${environment.BASE_URL}/Admin/add-new-subject`,SubjectData);
  }

  updateSubject(subjectData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/update-subject`, subjectData);
  }

  deleteSubject(subjectCode:any){
    return this.http.get<any>(`${environment.BASE_URL}/Admin/delete-subject/`+subjectCode);
  }

  allDepartments(is_active: boolean =false){
    const params = {
      is_active: is_active
    }
    return this.http.get(`${environment.BASE_URL}/Admin/show-all-departments`, {params});
  }

  addDepartment(departmentData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/add-new-department`,departmentData);
  }

  updateDepartment(departmentData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/update-department`, departmentData);
  }

  deleteDepartment(departmentCode:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/delete-department`, {departmentCode});
  }

  assignNewBatch(batchData: any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/assign-new-batch`, batchData);
  }

  allBatches(){
    return this.http.get(`${environment.BASE_URL}/Admin/show-all-batches`);
  }

  updateBatch(batchData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/update-batch`, batchData);
  }

  searchBatch(batchData:any){
    return this.http.post(`${environment.BASE_URL}/Admin/search-batch`,batchData);
  }

  deleteBatch(batchCode:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/delete-batch`, {batchCode});
  }

  addCategory(categoryData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/add-new-category`, categoryData);
  }

  updateCategory(categoryData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/update-category`, categoryData);
  }

  allCategory(is_active: boolean =false){
    const params = {
      is_active: is_active
    }
    return this.http.get(`${environment.BASE_URL}/Admin/show-all-category`, {params});
  }

  deleteCategory(categoryCode:any){
    return this.http.get<any>(`${environment.BASE_URL}/Admin/delete-category/`+categoryCode);
  }

  addQuestion(questionData: any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/add-feedback-question`, questionData);
  }

  allFeedbackQuestions(){
    return this.http.get(`${environment.BASE_URL}/Admin/show-all-feedback-questions`);
  }

  updateFeedbackQuestions(questionData:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/update-feedback-question`, questionData);
  }

  deleteFeedbackQuestion(questionId:any){
    return this.http.post<any>(`${environment.BASE_URL}/Admin/delete-feedback-question`, {questionId});
  }

  feedbackDashboardPage(){
    return this.http.get(`${environment.BASE_URL}/Student/feedback-dashboard-page`);
  }

  getDashboardCards() {
  return this.http.get<any>(`${environment.BASE_URL}/Admin/admin-dashboard`);
  }





  //URL for testing purpose
  testModel(testData: any): Observable<any>{
    return this.http.post(`${environment.BASE_URL}/GeneratePaySlip/test-model`,testData);
  }

  testModelGet(){
    return this.http.get(`${environment.BASE_URL}/GeneratePaySlip/test-model`);
  }
  
  deleteTestModel(){
    return this.http.get(`${environment.BASE_URL}/GeneratePaySlip/delete-test-model`);
  }

  testAdminLogin(params:any){
    return this.http.post(`${environment.BASE_URL}/Admin/class-based-view`, params, {withCredentials:true});
  }

  userData(){
    // debugger;
    return this.http.get(`${environment.BASE_URL}/Admin/user-data`, {withCredentials:true});
  }

}
