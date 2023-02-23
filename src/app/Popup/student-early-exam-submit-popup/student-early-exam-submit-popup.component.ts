import { Component, OnInit, Inject, AfterViewInit, OnDestroy,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-student-early-exam-submit-popup',
  templateUrl: './student-early-exam-submit-popup.component.html',
  styleUrls: ['./student-early-exam-submit-popup.component.scss']
})
export class StudentEarlyExamSubmitPopupComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private dialogScreen: MatDialogRef<StudentEarlyExamSubmitPopupComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private examService: ExamAPIService,
    private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService) { }

  result: any;

  checkStatus: any;
  exam_type:any;
  ngOnInit() {
    this.exam_type=this.data.exam_type;
  }

  ngAfterViewInit() {
    try {
      this.ngxLoader.start();
      this.examService.StudentExamSummary().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.result = response.data;
          this.ngxLoader.stop();
          this.checkStatus = setInterval(() => {
            this.CheckEarlyExamSubmitStatus();
          }, 3600)
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

  CheckEarlyExamSubmitStatus(): void{
    try {
      // this.ngxLoader.start();
      this.examService.CheckStudentEarlyExamSubmitStatus().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          // this.ngxLoader.stop();
          if(response.data.earlySubmissionStatus == 3){
            clearInterval(this.checkStatus);
            this.dialogScreen.close(3);
          }
          else if(response.data.earlySubmissionStatus == 1){
            clearInterval(this.checkStatus);
            this.dialogScreen.close(1);
          }
        }
        else {
          this.toastrService.error(response.message);
          // this.ngxLoader.stop();
        }
      }, error => {
        this.toastrService.error(error.message);
        // this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.toastrService.error(e.message);
      // this.ngxLoader.stop();
    }
  }

  ngOnDestroy(){
    clearInterval(this.checkStatus);
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
}
