import { Component, OnInit, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { QuestionService } from 'src/app/Services/question.service';
import { Subscription } from 'rxjs';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-common-instructions',
  templateUrl: './common-instructions.component.html',
  styleUrls: ['./common-instructions.component.scss']
})
export class CommonInstructionsComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private router: Router, private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService, private apiService: QuestionService, private dataService: DataService,private dialog: MatDialog, private examService: ExamAPIService) { }


  private pageInitInterval: any = null;

  showNextButton: boolean = true;
  
  winHeight:number;
  user:any;

  subscription: Subscription;

  ngOnInit() {
    this.ngxLoader.stopBackgroundLoader('loader-02')
    var instructionType = sessionStorage.getItem('instruction');
    instructionType == 'popup'?this.showNextButton = false: this.showNextButton = true;
    this.subscription = this.dataService.studentData.subscribe(response => {
      if (response) {
        
        this.user = response;
      }
    })
    // this.sendWarning();
    this.winHeight = window.innerHeight;
  }

  ngAfterViewInit() {
    
    sessionStorage.setItem('studentCommonInstruction', 'true');
    setTimeout(() => {
      // this.pageInitInterval = setInterval(() => {
        this.dataService.examStartAndTimer.next('');
        this.fetchQuestions();
        this.CheckExamStarts();
      // }, 3600)
    }, 10);
  }

  fetchQuestions(): void {
    try {
      this.apiService.questionFetch().subscribe(response => {
        
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          sessionStorage.setItem('questionFetch', 'true');
          this.dataService.examType.next(response.data.exam_type);
          if(response.data.exam_type=="23"){
            this.dataService.imageDetails.next(response.data.desc_img);          
          }else{
            this.dataService.questionsData.next(response.data.questionList);          
          }
          
          
          
          this.dataService.earlySubmitData.next(response.data.earlyTerminationStatus)
          this.dataService.questionFetch.next(true);
          // this.CheckExamStarts();
          // this.CheckExamStarts();
        }
        else {
          this.fetchQuestions();
          // this.toastrService.error(response.message);
        }
      }, error => {
        this.fetchQuestions();
        // this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.fetchQuestions();
      // this.toastrService.error(e.message);
    }
  }

  CheckExamStarts(): void {
    try {
      this.apiService.CheckExamStarts().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.dataService.examStartAndTimer.next(response.data);
          this.ngxLoader.stopBackgroundLoader('loader-02')
          // clearInterval(this.pageInitInterval);
        }
        else {
          if(response.message=='Exam paused'){
            this.ngxLoader.stopBackgroundLoader('loader-02')
          }
          // this.toastrService.error(response.message);
          this.CheckExamStarts();
        }
      }, error => {
       
        this.CheckExamStarts();
        // this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.CheckExamStarts();
      // this.toastrService.error(e.message);
    }
  }

  Next(): void {
    this.router.navigate(['/landing/student/exam/subjectspecificinstructions']);
  }

  ngOnDestroy() {
    // clearInterval(this.pageInitInterval);
    // this.subscription.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.returnValue = false;
    event.preventDefault();
    if (this.winHeight < window.innerHeight)
      this.winHeight = window.innerHeight;
    // var alreadyMarked = localStorage.getItem('SMP');
    // if (window.innerHeight != this.winHeight && alreadyMarked != 'true') {
     
    if (window.innerHeight != this.winHeight) {
    //this.MarkSMP()
    }
  }
  
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
    
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.returnValue = false;
    event.preventDefault();
  }

  MarkSMP(): void {
    try {
      this.ngxLoader.start();
      // localStorage.setItem('SMP', 'true');
      this.dataService.warning.next(true);
      this.router.navigate(['/landing/student/initial']);
      this.examService.MarkStudentSMP().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.ngxLoader.stop();
          this.toastrService.success(response.message);
          this.dialog.open(WarningComponent,
            {
              minWidth: '35%',
              disableClose: true,
              data:response.data.remainingCount
            });
        }
        else {
          // this.toastrService.error(response.message);
        }
      }, error => {
        // this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      // this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }
  sendWarning(): void {
    try {
      this.examService.CheckStudentSMP().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          if (response.data.isSMP) {
            // localStorage.setItem('SMP', 'true');
            this.dataService.warning.next(true);
            this.router.navigate(['/landing/student/initial']);
            this.dialog.open(WarningComponent,
              {
                minWidth: '35%',
                disableClose: true,
                data:response.data.remainingCount
              });
          }
        }
        else {
          // this.toastrService.error(response.message);
        }
      }, error => {
        // this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      // this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }
}
