import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material';
import { ExamSummaryComponent } from 'src/app/Popup/exam-summary/exam-summary.component';
import { CountdownComponent } from 'ngx-countdown';
import { Subscription } from 'rxjs';
import { EncryptionService } from 'src/app/Services/encryption.service';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { QuestionService } from 'src/app/Services/question.service';
import { StudentInstructionPopupComponent } from 'src/app/Popup/student-instruction-popup/student-instruction-popup.component';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { StudentEarlyExamSubmitPopupComponent } from 'src/app/Popup/student-early-exam-submit-popup/student-early-exam-submit-popup.component';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { ConfirmPopupComponent } from 'src/app/Popup/confirm-popup/confirm-popup.component';

import { CancelPopupComponent } from 'src/app/Popup/cancel-popup/cancel-popup.component';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadQuestionComponent } from 'src/app/Popup/upload-question/upload-question.component';
import { ExamPauseComponent } from 'src/app/Popup/exam-pause/exam-pause.component';
// 0 not visited
//   // 1 Visited but not answered
//   // 2 Answered
//   // 3 Review

@Component({
  selector: 'app-exam-start',
  templateUrl: './exam-start.component.html',
  styleUrls: ['./exam-start.component.scss']
})
export class ExamStartComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private toastrService: ToastrService, private router: Router,
    private dataService: DataService,
    private dialog: MatDialog, private encryptionService: EncryptionService,
    private dialogExamPause: MatDialog,
    private examService: ExamAPIService,
    private _sanitizer: DomSanitizer,
    private ngxLoader: NgxUiLoaderService, private questionService: QuestionService) { }


  imgComparison: boolean = false;
  imgVerified: boolean = false;

  public showWebcam = false;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public mirrorImage = 'always'
  public deviceId: string;
  public isEarly: boolean;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  isProctored: any;
  timerConfig: any;
  // time: number;
  sideNav: boolean = false;
  imagePath: any;
  examinationData: any = [];
  // examinationDataCopy: any = [];
  activeIndex: number = 0;
  answers: any = [];

  submitDisable: boolean = true;
  exam_type: any;
  desc_image: string = "";

  // warningSubscription: Subscription;
  questionSubscription: Subscription;
  questionDescSubscription: Subscription;
  examTypeSubscription: Subscription;
  timerSubscription: Subscription;
  sideNavSubscription: Subscription;
  studentData: any;
  status: any = {};
  duration: any;
  intervalTime: number = 0;
  @ViewChild('cd1', { static: false }) private countdown: CountdownComponent;

  private statusInitInterval: any = null;

  fullScr: boolean = false;
  winHeight: number;
  exam_status:string='start';

  ngOnInit() {
    this.isProctored = JSON.parse(sessionStorage.getItem("isProctored"))
    var studentData = sessionStorage.getItem('studentData');
    if (studentData) {
      var dec = this.encryptionService.decryptUsingAES256(studentData);
      this.studentData = JSON.parse(JSON.parse(dec));
      this.duration = this.studentData.duration

      this.intervalTime = (this.duration / 5) * 60000;
    }
    if (this.isProctored) {
      // WebcamUtil.getAvailableVideoInputs()
      //   .then((mediaDevices: MediaDeviceInfo[]) => {
      //     this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      //   });
    }
    sessionStorage.setItem('studentExamStart', 'true');
    this.dataService.sideNavButton.next(true);

    this.sendWarning();
    // }
    this.fullScr = true;
    this.winHeight = window.innerHeight;

    this.timerSubscription = this.dataService.examStartAndTimer.subscribe(response => {
      if (response) {
        response['time']['leftTime'] = response['time']['leftTime'] * 60;
        response['time']['notify'] = 30 * 60
        this.timerConfig = response["time"]; //, notify: [2 * 60, 9 * 60] 


      }
    })
    this.questionDescSubscription = this.dataService.imageDetails.subscribe(response => {
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'
        + response);
      this.examinationData = [{}]
    });
    this.examTypeSubscription = this.dataService.examType.subscribe(response => {
      this.exam_type = response;

    });
    this.questionSubscription = this.dataService.questionsData.subscribe(response => {
      if (response.length > 0) {
        this.examinationData = this.encryptionService.DecryptEncryption(response, ['question'], ['option'], ['imgUrl']);
        this.examinationData = this.examinationData.map(({ shuffleStatus, options, ...rest }) =>
          ({ shuffleStatus: shuffleStatus, options: shuffleStatus ? this.dataService.shuffle(options) : options, ...rest }));

        var checkFirstQuestion = this.examinationData.every(m => m.status == 0);
        if (checkFirstQuestion) {
          this.examinationData[0]["status"] = 1;
          this.answers.push({
            std_res_id: this.examinationData[0]["studentResponseId"],
            status: this.examinationData[0]["status"],
            option_id: this.examinationData[0]["answeredOption"]
          })
        }
        else {
          var answeredQuestions = this.examinationData.filter(f => f.answeredOption != 0);
          answeredQuestions.forEach(element => {
            this.answers.push({
              std_res_id: element["studentResponseId"],
              status: element["status"],
              option_id: element["answeredOption"]
            })
          });
        }
        this.status = {
          notVisited: this.examinationData.filter(d => d.status == 0).length,
          visited: this.examinationData.filter(d => d.status == 1).length,
          answered: this.examinationData.filter(d => d.status == 2).length,
          reviewed: this.examinationData.filter(d => d.status == 3).length
        }
      }
    })
    window.onpopstate = function (e) { window.history.forward(); }

    this.sideNavSubscription = this.dataService.sideNav.subscribe(response => {
      this.sideNav = !this.sideNav;
    })
    this.CheckStatusExamPause()
  }

  ngAfterViewInit() {
    // this.statusInitInterval = setInterval(() => {
    this.EarlyExamStatusCheck();
    // }, 3600)
    if (this.isProctored) {

      setTimeout(() => {
        this.triggerSnapshot()
      }, 30000)
    }


  }
  interval() {
    setTimeout(() => {
      this.triggerSnapshot()
    }, this.intervalTime)
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
      if(this.exam_status == 'start'){
        this.exam_pause_status='stop';
        this.MarkSMP();
      }
      
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


  handleEvent(event): void {
    if (this.timerConfig) {

      var timeLeft = event.left / 60000

      
      if (event.action == "start") {
        this.toastrService.success("Examination started");
      }

      else if (event.action == "notify") {
        this.toastrService.warning("You have " + timeLeft + " minutes left");
      }
      else if (event.action == "done") {
        clearInterval(this.statusInitInterval);
        this.exam_status='stop';
        this.submitDisable = false;
        this.toastrService.success("Examination completed");
        this.Submit();
        if (this.exam_type == 23) {
          this.uploadAnswerSheet();
        }
        // this.examSubmit();
      }
    }
  }

  GotoQuestion(index: number): void {
    this.activeIndex = index;
    if (this.examinationData[index]["status"] == 0)
      this.examinationData[index]["status"] = 1;
    var exists = this.answers.filter(q => q.std_res_id == this.examinationData[index].studentResponseId);
    if (exists.length == 0) {
      this.answers.push({
        std_res_id: this.examinationData[index]["studentResponseId"],
        status: this.examinationData[index]["status"],
        option_id: 0
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.std_res_id == exists[0].std_res_id);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
    }
    this.StudentResponseSubmit();
  }

  Answer(Qindex: number, Aindex: number, studentResponseId: number, event: any): void {
    // for (var i = 0; i < this.examinationData[Qindex]["options"].length; i++) {
    this.examinationData[Qindex]["answeredOption"] = 0;
    // }
    this.examinationData[Qindex]["answeredOption"] = event.value;
    if (this.examinationData[Qindex]["status"] != 3)
      this.examinationData[Qindex]["status"] = 2;

    var exists = this.answers.filter(q => q.std_res_id == studentResponseId)
    if (exists.length == 0) {
      this.answers.push({ std_res_id: studentResponseId, status: this.examinationData[Qindex]["status"], option_id: event.value });
    }
    else {
      var index = this.answers.findIndex(q => q.std_res_id == studentResponseId);
      this.answers[index]["status"] = this.examinationData[Qindex]["status"];
      this.answers[index]["option_id"] = event.value;
    }
    this.StudentResponseSubmit();
  }

  MarkASReview(index: number, status: number): void {
    if (status == 3) {
      if (this.examinationData[index]['answeredOption'] != 0)
        this.examinationData[index]["status"] = 2;
      else
        this.examinationData[index]["status"] = 1;
    }
    else
      this.examinationData[index]["status"] = 3;

    var exists = this.answers.filter(q => q.std_res_id == this.examinationData[index].studentResponseId);
    if (exists.length == 0) {
      this.answers.push({
        std_res_id: this.examinationData[index]["studentResponseId"],
        status: this.examinationData[index]["status"],
        option_id: 0
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.std_res_id == exists[0].std_res_id);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
    }

    this.StudentResponseSubmit();
  }

  Navigate(type: string, index: number, first: boolean, last: boolean): void {
    if (!last && type.toLowerCase() == 'next') {
      index = index + 1;
      this.activeIndex = index;
      if (this.examinationData[index]["status"] == 0)
        this.examinationData[index]["status"] = 1;
    }
    else if (!first && type.toLowerCase() == 'previous') {
      index = index - 1;
      this.activeIndex = index;
      if (this.examinationData[index]["status"] == 0)
        this.examinationData[index]["status"] = 1;
    }

    var exists = this.answers.filter(q => q.std_res_id == this.examinationData[index].studentResponseId);
    if (exists.length == 0) {
      this.answers.push({
        std_res_id: this.examinationData[index]["studentResponseId"],
        status: this.examinationData[index]["status"],
        option_id: 0
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.std_res_id == exists[0].std_res_id);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
    }
    this.StudentResponseSubmit();



  }

  Submit(): void {
    try {
      this.ngxLoader.start();
      this.examService.StudentExamSubmit().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          sessionStorage.removeItem('studentExamStart');

          this.ngxLoader.stop();
        }
        else {
          // this.toastrService.error(response.message);
          this.ngxLoader.stop();
        }
      }, error => {
        // this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      // this.toastrService.error(e.message);
      this.ngxLoader.stop();
    }
  }

  GoToSummary(): void {
    this.router.navigate(['/initial']);
    this.exam_status='submit';
    this.exam_pause_status='stop';
    this.dialog.open(ExamSummaryComponent,
      {
        minWidth: '35%',
        disableClose: true,
        data: {
          exam_type: this.exam_type,

        }
      });
  }
  uploadAnswerSheet() {
    this.countdown.pause();
    const dialogRef = this.dialog.open(UploadQuestionComponent,
      {
        minWidth: '35%',
        disableClose: true,
        data: {

        }
      });
    dialogRef.afterClosed().subscribe(response => {

    })
  }

  ClearResponse(index: number): void {
    var exists = this.answers.filter(q => q.std_res_id == this.examinationData[index].studentResponseId);
    this.examinationData[index]["answeredOption"] = 0;
    this.examinationData[index]["status"] = 1;
    if (exists.length > 0) {
      var optIndex = this.answers.findIndex(q => q.std_res_id == exists[0].std_res_id);
      this.answers[optIndex]["option_id"] = 0;
      this.answers[optIndex]["status"] = 1;
    }
    else {
      this.answers.push({
        std_res_id: this.examinationData[index]["studentResponseId"],
        status: this.examinationData[index]["status"],
        option_id: 0
      });
    }
    this.StudentResponseSubmit();
  }

  StudentResponseSubmit(): void {
    try {
      this.examService.StudentResponseSubmit(this.answers).subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          //each and every response submit success
          this.status = {
            notVisited: this.examinationData.filter(d => d.status == 0).length,
            visited: this.examinationData.filter(d => d.status == 1).length,
            answered: this.examinationData.filter(d => d.status == 2).length,
            reviewed: this.examinationData.filter(d => d.status == 3).length
          }
        }
        else {
          // this.toastrService.error(response.message);
        }
      }, error => {
        // this.toastrService.error(error.message);
      })
    }
    catch (e) {
      // this.toastrService.error(e.message);
    }
  }

  FilterQuestions(value: number): void {
    // if (value)
    // this.examinationData = this.examinationData.filter(d => d.status == value);
  }

  CheckStatus(): void {
    try {
      this.questionService.CheckExamStarts().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
        }
        else {
          sessionStorage.setItem('instruction', 'normal');
          // clearInterval(this.statusInitInterval);
          this.router.navigate(["/landing/student/exam"]);
          sessionStorage.removeItem('studentExamStart');
          // this.toastrService.error(response.message);
        }
      }, error => {
        this.CheckStatus();
        // this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.CheckStatus();
      // this.toastrService.error(e.message);
    }
  }

  
  CheckStatusExamPause(): void {
    try {
      this.questionService.CheckExamStarts().subscribe(response => {
        
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else{
          setTimeout(() => {
            this.CheckStatusExamPause()
          }, 1000);
        
          if(this.exam_pause_status=='start'){
            if(response.message=="Exam paused"){            
              this.dialogExamPause.closeAll();
              this.dialogExamPause.open(ExamPauseComponent,
                {
                  width: '30%'
                });
            }
            else if(response.message=="Exam started"){
              this.dialogExamPause.closeAll();
            }
          }
         
        }
      }, error => {
        setTimeout(() => {
          this.CheckStatusExamPause()
        }, 1000);
      
      })
    }
    catch (e) {
      setTimeout(() => {
        this.CheckStatusExamPause()
      }, 1000);
      
    }
  }


  GoToInstructions(): void {
    sessionStorage.setItem('instruction', 'popup');
    this.dialog.open(StudentInstructionPopupComponent,
      {
        width: '80%',
        height: '80%'
      });
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
                disableClose: true
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
              data: response.data.remainingCount
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
  exam_pause_status:any='start';
  RequestSummary(): void {
    this.exam_pause_status='stop';
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '40%',
      data: {
        title: "The early examination submission request will be sent to the invigilator for approval. Once the request got approved, you will not be able to continue attending the examination.",
        title2: "  Do you want to proceed with this?"
      }
    })
    dialogRef.afterClosed().subscribe(response => {
      var isSubmit = dialogRef.componentInstance.isSubmit;
      
      if (isSubmit) {
        this.exam_pause_status='stop';
        this.exam_status='early_submit';
        try {
          this.ngxLoader.start();
          this.examService.StudentEarlyExamSubmit().subscribe(response => {
            if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
              this.dataService.LogOut();
            }
            else if (response.success) {
              this.countdown.pause();
              
              const dialogref = this.dialog.open(StudentEarlyExamSubmitPopupComponent,
                {
                  minWidth: '35%',
                  disableClose: true,
                  data: { exam_type: this.exam_type }
                });
              dialogref.afterClosed().subscribe(response => {
                if (response) {
                  if (response == 3) {
                    this.Submit();
                    this.submitDisable = false;
                    if (this.exam_type == 23) {
                      this.uploadAnswerSheet();
                    }
                  }
                  else {
                    const dialogRef = this.dialog.open(CancelPopupComponent, {
                      width: '40%',
                      data: { title: "Your early request has been declined" },
                      disableClose: true

                    })
                    dialogRef.afterClosed().subscribe(response => {
                      var isSubmit = dialogRef.componentInstance.isSubmit;
                      if (isSubmit) {
                        this.countdown.resume();
                      }
                    })


                  }
                  // else if(response == 1)
                  // this.submitDisable = false;
                }
                // else{
                //   this.submitDisable = true;
                // }
              })
            }
            else {
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
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
      }else{
        this.exam_pause_status='start';
      }
    })
  }

  EarlyExamStatusCheck(): void {
    try {
      this.ngxLoader.start();
      this.examService.CheckStudentEarlyExamSubmitStatus().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          if (response.data.earlySubmissionStatus == 2) {
            this.RequestSummary();
          }

          else if (response.data.earlySubmissionStatus == 3) {
            this.Submit();
            this.countdown.pause();
            this.submitDisable = false;
          }
          else {
            this.CheckStatus();
          }
          this.ngxLoader.stop();
        }
        else {
          // this.toastrService.error(response.message);
          this.ngxLoader.stop();
        }
      }, error => {
        // this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      // this.toastrService.error(e.message);
      this.ngxLoader.stop();
    }
  }

  ngOnDestroy() {
    this.sideNavSubscription.unsubscribe();
    this.timerSubscription.unsubscribe();
    this.questionSubscription.unsubscribe();
    this.questionDescSubscription.unsubscribe();
    this.examTypeSubscription.unsubscribe();
    // clearInterval(this.statusInitInterval);
  }


  public triggerSnapshot(): void {

    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.dataService.playAudio()
    this.webcamImage = webcamImage;

    try {
      // this.ngxLoader.start();
      var body = {
        webCamImage: this.webcamImage['_imageAsDataUrl'].substring(23) // remove unwanted data from base64
      }
      this.examService.RandomImageCapture(body).subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          if (response.data.remaining != 0) {
            this.interval();
          }
          // else {
          //   this.toastrService.error(response.message);
          //   this.ngxLoader.stop();
          // }
        }
        else {
          this.interval();
          // this.toastrService.error(response.message);
          // this.ngxLoader.stop();
        }
      }, error => {
        this.interval();
        // this.toastrService.error(error.message);
        // this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.interval();
      // this.toastrService.error(e);
      // this.ngxLoader.stop();
    }

  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}
