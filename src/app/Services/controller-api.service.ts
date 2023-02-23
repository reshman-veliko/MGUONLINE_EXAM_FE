import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import { URLService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerAPIService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }


  RecaptchaVerification(body: any): any {
    return this.http.post(this.URLService.cloudBaseURL + this.URLService.recaptchaVerificationURL, body);
  }

  CheckValidController(): any {
    var body = this.dataService.controllerData.value;
    return this.http.post(this.URLService.cloudBaseURL + this.URLService.checkValidControllerURL, body);
  }

  ControllerLogin(body: object): any {
    return this.http.post(this.URLService.cloudBaseURL + this.URLService.controllerLoginURL, body);
  }

  CheckOTP(body: any): any {
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.cloudBaseURL + this.URLService.controllerOTPVerificationURL, body);
  }

  ExamFetchFromMainServer(): any {
    return this.http.post(this.URLService.baseURL + this.URLService.examFetchFormCloudServerURL, this.dataService.controllerData.value);
  }

  ExaminationInfo(): any {
    return this.http.post(this.URLService.baseURL + this.URLService.examStudentFetchURL, this.dataService.controllerData.value);
  }

  studentFaceRecognition(body): any {
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.studentFaceRecognitionURL, body);
  }

  SingleStudentVerification(body: object): any {
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.singleStudentVerifyURL, body);
  }

  SubmitAllExams(body: object): any {
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.submitAllExamsURL, body);
  }

  ExaminationInfoForVerifiedStudents(): any {
    return this.http.post(this.URLService.baseURL + this.URLService.examVerifiedStudentFetchURL, this.dataService.controllerData.value);
  }

  InvigilatorStartExam(body: object): any {
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.invigilatorStartExamURL, body);
  }

  FetchReservedSystems(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.fetchReservedSystemsURL, this.dataService.controllerData.value);
  }

  SystemChange(body: object): any{
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.individualStudentSystemChangeURL, body);
  }

  TimePauseresume(body: any): any {
    var URL = '';
    if (body['type'] == "pause")
      URL = this.URLService.individualStudentTimePauseURL;
    else if (body['type'] == "resume")
      URL = this.URLService.individualStudentTimeResumeURL;
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + URL, body);
  }

  IndividualStudentSMPList(body: any): any {
    return this.http.post(this.URLService.baseURL + this.URLService.individualStudentSMPListURL, body);
  }

  StudentSMPBlock(body: any): any {
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.individualStudentSMPBlockURL, body);
  }
  StudentSMPAllow(body: any): any {
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.individualStudentSMPAllowURL, body);
  }
  
  SubmitExam(body: any): any {
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.invigilatorExamSubmitURL, body);
  }

  LateComerTimeConfig(): any {
    return this.http.post(this.URLService.baseURL + this.URLService.lateComerTimeConfigURL, this.dataService.controllerData.value);
  }

  ExamSummary(): any {
    return this.http.post(this.URLService.baseURL + this.URLService.examSummaryURL, this.dataService.controllerData.value);
  }

  CheckAllStudentExamCompleted(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.checkIfAllStudentsExamCompletedURL, this.dataService.controllerData.value);
  }

  StudentExamSummary(body: any): any{
    return this.http.post(this.URLService.baseURL + this.URLService.invigilatorStudentExamSummaryURL, body);
  }

  StudentRandonImage(body: any): any{
    return this.http.post(this.URLService.baseURL + this.URLService.studentRandomImageUrl, body);
  }

  InvigilatorStudentEarlyExamSubmit(body: any): any{
    return this.http.post(this.URLService.baseURL + this.URLService.invigilatorStudentEarlyExamSubmitURL, body);
  }

}
