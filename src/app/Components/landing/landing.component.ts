import { Component, OnInit, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { HallticketAuthService } from 'src/app/Services/hallticket-auth.service';
import { EncryptionService } from 'src/app/Services/encryption.service';
import { QuestionService } from 'src/app/Services/question.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(public dataService: DataService, private router: Router, private authHallTicket: HallticketAuthService,
    private deviceService: DeviceDetectorService, private auth: ControllerAuthService, private service: ControllerAPIService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService, private studentService: StudentLoginAPIService,
    private encryptionService: EncryptionService, private questionService: QuestionService) { }

  logo = {
    img: "../../../assets/Images/Logo.png",
    alt: "logo"
  }
  user: any;

  sideNavVisible: boolean = false;

  private pageInitInterval: any = null;


  ngOnInit() {
    this.dataService.controllerData.next({
      email: sessionStorage.getItem("email"),
      userId: sessionStorage.getItem("userId"),
      sessionId: sessionStorage.getItem("sessionId")
    })
    this.dataService.studentCredentials.next({
      examStudentId: sessionStorage.getItem("examStudentId")
    })
    this.dataService.sideNavButton.next(false);
  }

  ngAfterViewInit() {

    var loggedInUser = sessionStorage.getItem("loginUser");
    
    // var questionFetch = sessionStorage.getItem("questionFetch");
    var studentData = sessionStorage.getItem('studentData');
    if (loggedInUser == 'student') {
      setTimeout(() => {
        // this.pageInitInterval = setInterval(() => {
          this.dataService.examStartAndTimer.next('');
          this.fetchQuestions();
          this.CheckExamStarts();
        // }, 3600)
      }, 100);
    }

    if (loggedInUser == 'invigilator') {
      setTimeout(() => {
        this.checkValidUser();
      }, 100);
    }
    else if (loggedInUser == 'student') {
      setTimeout(() => {
        this.CheckValidStudent();
      }, 100);
    }


    if (studentData && loggedInUser == 'student') {
      setTimeout(() => {
        this.FetchStudentDetails()
      }, 100);
    }
  }

  // @HostListener('contextmenu', ['$event'])
  // onRightClick(event) {
  //   event.preventDefault();
  // }

  sideNavToggle(): void {
    this.dataService.sideNav.next(true);
  }

  checkValidUser(): void {
    try {
      this.ngxLoader.start();
      var acceptInstruction = sessionStorage.getItem('AcceptInstruction');
      var controllerStartExam = sessionStorage.getItem('controllerExamStart');
      if (sessionStorage.getItem("userId") && !acceptInstruction && !controllerStartExam) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              var controller = {
                userId: sessionStorage.getItem("userId"),
                sessionId: sessionStorage.getItem("sessionId"),
                email: sessionStorage.getItem("email")
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/invigilator/instruction"]);
            }
            else {
              this.router.navigate(["/landing/invigilator/login"]);
             //this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/invigilator/login"]);
           //this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/invigilator/login"]);
         //this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (sessionStorage.getItem("userId") && (acceptInstruction && acceptInstruction == 'true')
        && !controllerStartExam) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              var controller = {
                userId: sessionStorage.getItem("userId"),
                sessionId: sessionStorage.getItem("sessionId"),
                email: sessionStorage.getItem("email"),
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/invigilator/dashboard"]);
            }
            else {
              this.router.navigate(["/landing/invigilator/login"]);
             //this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/invigilator/login"]);
           //this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/invigilator/login"]);
         //this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (sessionStorage.getItem("userId") && (acceptInstruction && acceptInstruction == 'true')
        && (controllerStartExam && controllerStartExam == 'true')) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              var controller = {
                userId: sessionStorage.getItem("userId"),
                sessionId: sessionStorage.getItem("sessionId"),
                email: sessionStorage.getItem("email"),
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/invigilator/examstart"]);
            }
            else {
              this.router.navigate(["/landing/invigilator/login"]);
             //this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/invigilator/login"]);
           //this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/invigilator/login"]);
         //this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else {
        this.router.navigate(["/landing/invigilator/login"]);
        this.ngxLoader.stop();
      }
    }
    catch (e) {
     //this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  CheckValidStudent(): void {
    try {
      this.ngxLoader.start();
      var examStudentId = sessionStorage.getItem('examStudentId');
      var studentData = sessionStorage.getItem('studentData');
      var commonInstruction = sessionStorage.getItem('studentCommonInstruction');
      var subjectSpecificInstruction = sessionStorage.getItem('studentSubjectSpecificInstruction');
      var examStarts = sessionStorage.getItem('studentExamStart');
      if (examStudentId && studentData && commonInstruction != 'true' &&
        subjectSpecificInstruction != 'true' && examStarts != 'true') {
        try {
          this.ngxLoader.start();
          this.studentService.CheckValidStudent().subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              this.ngxLoader.stop();
              this.router.navigate(["/landing/student/initial"]);
            }
            else {
              this.router.navigate(["/landing/student"]);
             //this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/student"]);
           //this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/student"]);
         //this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (examStudentId && studentData && commonInstruction == 'true'
        && subjectSpecificInstruction != 'true' && examStarts != 'true') {
        try {
          this.ngxLoader.start();
          this.studentService.CheckValidStudent().subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              this.ngxLoader.stop();
              this.authHallTicket.hallTicketValid();
              // this.dataService.toggleFullScreen();
              this.dataService.isNotLoginScreen.next(true);
              this.router.navigate(["/landing/student/initial"]);
            }
            else {
              this.router.navigate(["/landing/student/initial"]);
             //this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/student/initial"]);
           //this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/student/initial"]);
         //this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (examStudentId && studentData && commonInstruction == 'true' &&
        subjectSpecificInstruction == 'true' && examStarts != 'true') {
        try {
          this.ngxLoader.start();
          this.studentService.CheckValidStudent().subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              this.ngxLoader.stop();
              this.authHallTicket.hallTicketValid();
              // this.dataService.toggleFullScreen();
              this.dataService.isNotLoginScreen.next(true);
              this.router.navigate(["/landing/student/initial"]);
            }
            else {
              this.router.navigate(["/landing/student/initial"]);
             //this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/student/initial"]);
           //this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/student/initial"]);
         //this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (examStudentId && studentData && commonInstruction == 'true' &&
        subjectSpecificInstruction == 'true' && examStarts == 'true') {
        try {
          this.ngxLoader.start();
          this.studentService.CheckValidStudent().subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              this.ngxLoader.stop();
              this.authHallTicket.hallTicketValid();
              // this.dataService.toggleFullScreen();
              this.dataService.isNotLoginScreen.next(true);
              this.router.navigate(["/landing/student/initial"]);
            }
            else {
              this.router.navigate(["/landing/student/initial"]);
             //this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/student/initial"]);
           //this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/student/initial"]);
         //this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else {
        this.router.navigate(["/landing/student"]);
        this.ngxLoader.stop();
      }
    }
    catch (e) {
     //this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  fetchQuestions(): void {
    try {
      this.questionService.questionFetch().subscribe(response => {
        
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          sessionStorage.setItem('questionFetch', 'true');
          this.dataService.questionsData.next(response.data.questionList);
          this.dataService.earlySubmitData.next(response.data.earlyTerminationStatus)

            // this.CheckExamStarts();
        }
        else {
          this.fetchQuestions();
          ////this.toastrService.error(response.message);
        }
      }, error => {
        this.fetchQuestions();
       //this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.fetchQuestions();
     //this.toastrService.error(e.message);
    }
  }

  CheckExamStarts(): void {
    try {
      this.questionService.CheckExamStarts().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.dataService.examStartAndTimer.next(response.data);
          // clearInterval(this.pageInitInterval);
        }
        else {
          this.CheckExamStarts();
          // sessionStorage.removeItem('studentExamStart');
          ////this.toastrService.error(response.message);
        }
      }, error => {
        this.CheckExamStarts();
       //this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.CheckExamStarts();
     //this.toastrService.error(e.message);
    }
  }

  FetchStudentDetails(): void {
    try {
      var studentData = sessionStorage.getItem('studentData');
      var dec = this.encryptionService.decryptUsingAES256(studentData);
      this.dataService.studentData.next(JSON.parse(JSON.parse(dec)));
    }
    catch (e) {
     //this.toastrService.error(e);
    }
  }

  Logout(): void {
   this.dataService.LogOut();
  }

  ngOnDestroy() {
    // clearInterval(this.pageInitInterval);
  }


}
