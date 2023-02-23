import { Component, OnInit,ViewChild, Inject, AfterViewInit,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CountdownComponent } from 'ngx-countdown';
@Component({
  selector: 'app-upload-question',
  templateUrl: './upload-question.component.html',
  styleUrls: ['./upload-question.component.scss']
})
export class UploadQuestionComponent implements OnInit, AfterViewInit {

  constructor(private dialogScreen: MatDialogRef<UploadQuestionComponent>,
     private dataService: DataService,
    private examService: ExamAPIService,
    private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService) { }

    @ViewChild('cd1', { static: false }) private countdown: CountdownComponent;
  ngOnInit() {
  }

  ngAfterViewInit() {
 
  }
  timerConfig: any={leftTime: 20*60,notify:60*30};
  handleEvent(event): void {
    if (this.timerConfig) {

      var timeLeft = event.left / 60000
      
      
      if (event.action == "start") {
       
      }

      
      else if (event.action == "done") {        
        this.toastrService.success("Time out to upload question paper");
        this.dialogScreen.close({data:false});
        // this.examSubmit();
      }
    }
  }


  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
  qp_file: any;
  submitAnswerSheet() {

    if (!this.qp_file) {
      return
    }
    const formData: FormData = new FormData();
    formData.append('answersheet', this.qp_file);
    formData.append('examStudentId', sessionStorage.getItem("examStudentId"));
    formData.append('exam_id', this.dataService.studentData.value.examId);
    this.ngxLoader.start();
    
    this.examService.uploadAnswerSheet(formData).subscribe(response => {
      this.ngxLoader.stop();
      if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
        this.dataService.LogOut();
      }else if (response.success) {
        this.toastrService.success("Sucessfully uploaded");
        this.dialogScreen.close({data:true});
      }else{
        this.toastrService.error("failed to uploaded");
      }
    });
  }
  pngSelect(e: any): void {
    try {
      const file = e.target.files[0];
      this.qp_file = file;
      const fReader = new FileReader()
      fReader.readAsDataURL(file)
      fReader.onloadend = (_event: any) => {

      }
    } catch (error) {

      console.log('no file was selected...');
    }

  }
}
