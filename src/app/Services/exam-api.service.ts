import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { URLService } from './url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamAPIService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }

  // examDetails(data: any): any{
  //   data["userId"] = this.dataService.body["userId"];
  //   data["sessionId"] = this.dataService.body["sessionId"];
  //   return this.http.post(this.URLService.baseURL + this.URLService.examDetails, data);
  // }

  UnlockStudentSMP(body: any): any {
    body = Object.assign(body, this.dataService.studentCredentials.value);
    return this.http.post(this.URLService.baseURL + this.URLService.UnlockStudentSMPURL, body);
  }

  MarkStudentSMP(): any {
    // var body = this.dataService.studentCredentials.value;
    // body['timeRemains'] = Math.round(parseInt(localStorage.getItem('freq'))/6000);
    return this.http.post(this.URLService.baseURL + this.URLService.markStudentSMPURL, this.dataService.studentCredentials.value);
  }

  StudentResponseSubmit(body: any): any {
    var data = Object.assign({}, {responseList: body}, this.dataService.studentCredentials.value);
    
    // body['timeRemains'] = Math.round(parseInt(localStorage.getItem('freq'))/6000);
    return this.http.post(this.URLService.baseURL + this.URLService.StudentResponseSubmitURL, data);
  }

  StudentExamSubmit(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.studentExamSubmitURL, this.dataService.studentCredentials.value);
  }

  StudentExamSummary(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.studentExamSummaryURL, this.dataService.studentCredentials.value);
  }
  uploadAnswerSheet(body): any{
    return this.http.post(this.URLService.baseURL + this.URLService.answersheetUploadURL, body);
  }
  CheckStudentSMP(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.checkSMPURL, this.dataService.studentCredentials.value);
  }

  StudentEarlyExamSubmit(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.studentEarlySubmitRequestURL, this.dataService.studentCredentials.value);
  }

  CheckStudentEarlyExamSubmitStatus(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.checkStudentEarlyExamSubmitStatusURL, this.dataService.studentCredentials.value);
  }

  RandomImageCapture(body: any): any{
    body = Object.assign(body, this.dataService.studentCredentials.value);
    return this.http.post(this.URLService.baseURL + this.URLService.randomImageCaptureURL, body);
  }
  SMPCodeFetch(body: any): any {
    // body = Object.assign(body);
    return this.http.post(this.URLService.baseURL + this.URLService.SMPCodeFetchURL, body);
  }

  StudentStatusVerification(body: any): any {
    // body = Object.assign(body);
    return this.http.post(this.URLService.baseURL + this.URLService.studentStatusVerification, body);
  }

}
