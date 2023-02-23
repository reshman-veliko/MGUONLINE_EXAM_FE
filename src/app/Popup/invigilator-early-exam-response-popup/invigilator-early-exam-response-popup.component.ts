import { Component, OnInit, Inject, AfterViewInit,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';

@Component({
  selector: 'app-invigilator-early-exam-response-popup',
  templateUrl: './invigilator-early-exam-response-popup.component.html',
  styleUrls: ['./invigilator-early-exam-response-popup.component.scss']
})
export class InvigilatorEarlyExamResponsePopupComponent implements OnInit, AfterViewInit {

  constructor(private dialogScreen: MatDialogRef<InvigilatorEarlyExamResponsePopupComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private service: ControllerAPIService,
    private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService) { }

  result: any;

  ngOnInit() {
    }

  ngAfterViewInit() {
    try {
      this.ngxLoader.start();
      var body = this.dataService.controllerData.value;
      body["examStudentId"] = this.data.examStudentId;
      this.service.StudentExamSummary(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.result = response.data;
          this.result['name']=this.data.name
          this.result['hallTicketNumber']=this.data.hallTicketNumber
          this.ngxLoader.stop();
        }
        else {
          this.toastrService.error(response.message);
          this.ngxLoader.stop();
        }
      }, error => {
        this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.toastrService.error(e.message);
      this.ngxLoader.stop();
    }
  }

  EarlySubmit(type: number): void{
    try {
      this.ngxLoader.start();
      var body = this.dataService.controllerData.value;
      body["examStudentId"] = this.data.examStudentId;
      body["status"] = type;
      this.service.InvigilatorStudentEarlyExamSubmit(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.ngxLoader.stop();
          this.dialogScreen.close(true);
        }
        else {
          this.toastrService.error(response.message);
          this.ngxLoader.stop();
        }
      }, error => {
        this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.toastrService.error(e.message);
      this.ngxLoader.stop();
    }
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
}
