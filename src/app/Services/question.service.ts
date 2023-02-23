import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { URLService } from './url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }

  questionFetch(): any{
    var body = this.dataService.studentCredentials.value;
    return this.http.post(this.URLService.baseURL + this.URLService.questionFetchURL, body);
  }

  CheckExamStarts(): any{
    var body = this.dataService.studentCredentials.value;
    if(this.dataService.studentData.value)
    body['examId'] = this.dataService.studentData.value.examId;
    return this.http.post(this.URLService.baseURL + this.URLService.checkExamStartsURL, body);
  }

}
