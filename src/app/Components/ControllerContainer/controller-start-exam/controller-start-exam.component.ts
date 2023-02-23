import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CountdownComponent } from 'ngx-countdown';
import { InvigilatorSMPPopupComponent } from 'src/app/Popup/invigilator-smp-popup/invigilator-smp-popup.component';
import { ConfirmationPopupComponent } from 'src/app/Popup/confirmation-popup/confirmation-popup.component';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';
import { InvigilatorExamSummaryComponent } from 'src/app/Popup/invigilator-exam-summary/invigilator-exam-summary.component';
import { Router } from '@angular/router';
import { InvigilatorInstructionPopupComponent } from 'src/app/Popup/invigilator-instruction-popup/invigilator-instruction-popup.component';
import { DataService } from 'src/app/Services/data.service';
import { InvigilatorEarlyExamResponsePopupComponent } from 'src/app/Popup/invigilator-early-exam-response-popup/invigilator-early-exam-response-popup.component';
import { RandomImagePopupComponent } from 'src/app/Popup/random-image-popup/random-image-popup.component';
@Component({
  selector: 'app-controller-start-exam',
  templateUrl: './controller-start-exam.component.html',
  styleUrls: ['./controller-start-exam.component.scss']
})
export class ControllerStartExamComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog, private service: ControllerAPIService, private router: Router,
    private dataService: DataService) { }

  masterTimerConfig: any;
  masterSubmitValid: boolean = false;
  element:any;

  totalStableDuration: any;

  private lateComerObservable: any = null;
  private lateComerObservableOnPageLoad: any = null;
  private allStudentsExamCompletedInterval: any = null;

  studentTimerPauseResumeCaption: string = "Do you want to Pause/Resume this student?"
  isProctored=JSON.parse(sessionStorage.getItem("isProctored"))
  isExamStarted: boolean;
  examList: Array<object> = [];
  examListCopy: Array<object>;
  backupSystems: Array<object>;
  displayedColumns: any;
  headerCaption:any; 
  islate:boolean=false;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();// stepper 1
  @ViewChildren('myPaginator') studentListPaginator: QueryList<ElementRef>;
  @ViewChildren('masterTimer') masterTimer: CountdownComponent;
  @ViewChildren('studentTimer') studentTimer: QueryList<ElementRef>;

  @ViewChildren('systems') systems: QueryList<ElementRef>;

  examTimerCompleted: boolean = false;

  ngOnInit() {
    if(!this.isProctored){
      this.displayedColumns = ['sno', 'name', 'hallTicketNumber', 'systemNo', 'timer', 'action'];
      this.headerCaption = JSON.parse(JSON.stringify({// stepper 1
        caption1: "S/No",
        caption2: "Name",
        caption3: "Hall TicketNo",
        caption4: "System No",
        caption5: "Timer",
        caption6: "Action"
      }))
    }
    else{
      this.displayedColumns = ['sno', 'name', 'hallTicketNumber', 'phoneNumber', 'timer', 'action'];
      this.headerCaption = JSON.parse(JSON.stringify({// stepper 1
        caption1: "S/No",
        caption2: "Name",
        caption3: "Hall TicketNo",
        caption4: "Phone Number",
        caption5: "Timer",
        caption6: "Action"
      }))
    }

  }

  ngAfterViewInit() {
    this.FetchExamList();
    // this.lateComerObservableOnPageLoad = setInterval(() => {
      if(!this.isProctored){
        this.LateComersTimeConfiguration();
      }
      
    // }, 1000);
  }

  handleMasterTimerEvent(event): void {
    var timeLeft = event.left / 60000;

    if (event.action == "start") {
      if (this.isExamStarted && timeLeft != 0)
        this.toastrService.success("Examination started");
    }
    else if (event.action == "notify") {
      this.toastrService.warning("You have " + timeLeft + " minutes left");
    }
    else if (event.action == "done") {
      this.islate=true
      if (!this.isExamStarted) {
        this.ngxLoader.start();
        setTimeout(() => {
          this.FetchExamList();
        }, 500);
      }
      else {
        this.toastrService.success("Examination time completed");
        this.examTimerCompleted = true;
        // this.allStudentsExamCompletedInterval = setInterval(() => {
        this.CheckAllStudentsExamCompleted();
      // }, 1000);
      }
    }
  }

  CheckAllStudentsExamCompleted(): void {
    try {
      this.service.CheckAllStudentExamCompleted().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          if(response.data.isExamCompleted){
            this.masterSubmitValid = true;
            // clearInterval(this.allStudentsExamCompletedInterval);
          }
        }
        else {
          this.CheckAllStudentsExamCompleted();
          this.toastrService.error(response.message);
        }
      }, error => {
        this.CheckAllStudentsExamCompleted();
        this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.CheckAllStudentsExamCompleted();
      this.toastrService.error(e);
    }
  }


  FetchExamList(): void {
    try {
      this.ngxLoader.start();
      this.service.ExaminationInfoForVerifiedStudents().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.FetchReservedSystems();
          this.isExamStarted = response.data.isExamStarted;
          this.examList = response.data.studentList;
          this.examListCopy = this.examList.map(x => Object.assign({}, x));
          this.masterTimerConfig = { leftTime: response.data.examDuration * 60 };//, notify: [2 * 60, 9 * 60]
          
          this.TableRefresh();
          setTimeout(() => {
            this.CheckAllStudentTimer();
          }, 10);
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
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
    
  }

  FetchReservedSystems(): void {
    try {
      this.ngxLoader.start();
      this.service.FetchReservedSystems().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.backupSystems = response.data.reservedSystems;
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
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  TableRefresh(): void {
    this.examList.forEach((element, index) => {
      element['studentList'] = new MatTableDataSource<any>(element['studentList']);
      setTimeout(() => {
        element['studentList'].paginator = this.paginator.toArray()[index];
        element['studentList'].sort = this.sort.toArray()[index];
      }, 10);

      element['studentList']['data'] = element['studentList']['data'].map(({ timeLeft, ...rest }) =>
        ({ timeLeft: { leftTime: !this.isExamStarted ? 0 : timeLeft == 'null' ? 0 : timeLeft * 60 }, ...rest }));
    });
  }

  StudentTimerPauseResume(index: number, rowIndex: number, status: number, check?: any): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '40%',
      data: { title: "Do you want to Pause/Resume time for this student?" }
    })
    dialogRef.afterClosed().subscribe(response => {
      var isSubmit = dialogRef.componentInstance.isSubmit;
      if (isSubmit) {
        try {
          var length = 0;
          if (index > 0) {
            for (var i = 0; i < index; i++) {
              length = length + this.examList[i]['studentList']['data'].length;
            }
          }
          this.ngxLoader.start();
          // var body = {
          //   type: status == 3 || status == 2 ? 'pause' : status == 4 ? 'resume' : '',
          //   examStudentId: this.examList[index]['studentList']['data'][rowIndex]['examStudentId']
          // }

          var body = this.dataService.controllerData.value;
          body["examStudentId"] = this.examList[index]['studentList']['data'][rowIndex]['examStudentId']
          body["type"]= status == 3 || status == 2 ? 'pause' : status == 4 ? 'resume' : '',

          this.service.TimePauseresume(body).subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              this.StudentTimePauseResumeConfig(index, rowIndex, status, check);
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
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
    })
  }

  StudentTimePauseResumeConfig(index: number, rowIndex: number, status: number, check?: any): void {
    var length = 0;
    if (index > 0) {
      for (var i = 0; i < index; i++) {
        length = length + this.examList[i]['studentList']['data'].length;
      }
    }
    if (!check)
      this.examList[index]['studentList']['data'][rowIndex]['status'] = (status == 3 || status == 2) ? 4 : status == 4 ? 3 : status;
    if (status == 3 || status == 2)
      this.studentTimer['_results'][length + rowIndex].pause();
    else if (status == 4)
      this.studentTimer['_results'][length + rowIndex].resume();
    if (!check && (status == 3 || status == 2)) {
      this.examList[index]['studentList']['data'][rowIndex]['time'] =
        (this.studentTimer['_results'][length + rowIndex]['i']['value'] / 1000);
    }
  }

  CheckAllStudentTimer(): void {
    var pauseIndex = [];
    this.examList.forEach((examList, examIndex) => {
      examList['studentList']['data'].forEach((row, rowIndex) => {
        if (row['status'] == 4 || row['status'] == 5 || row['status'] == 1 || row['status'] == 6)
          pauseIndex.push({ row: rowIndex, parent: examIndex });
      });
    });
    pauseIndex.forEach(element => {
      this.StudentTimePauseResumeConfig(element.parent, element.row, 3, true);
    });
  }

  SystemChange(oldSystemId: number, oldSystemValue: string, reservedSystemId: number,
    reservedSystemValue: string, index: number, rowIndex: number, optIndex: number, examStudentId: number): void {
    try {
      this.ngxLoader.start();
      var body = {
        examStudentId: examStudentId,
        newSystemId: reservedSystemId,
        preSystemId: oldSystemId
      }
      this.service.SystemChange(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.examList[index]['studentList']['data'][rowIndex]['systemNo'] = reservedSystemValue;
          this.examList[index]['studentList']['data'][rowIndex]['systemId'] = reservedSystemId;
          this.backupSystems.splice(optIndex, 1);
          this.toastrService.success(response.message);
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
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  handleStudentTimerEvent(event: any, index: number, rowIndex: number): void {

    if (event.action == "done") {
      var length = 0;
      if (index > 0) {
        for (var i = 0; i < index; i++) {
          length = length + this.examList[i]['studentList']['data'].length;
        }
      }
      if (this.studentTimer['_results'][length + rowIndex])
        this.studentTimer['_results'][length + rowIndex].stop();
      if (this.examList[index]['studentList']['data'])
        this.examList[index]['studentList']['data'][rowIndex]['timerCompleted'] = true;
    }
  }

  StudentSMP(data: object, index: number, rowIndex: number): void {
    const dialogRef = this.dialog.open(InvigilatorSMPPopupComponent, {
      width: '40%',
      // height: '100%',
      data: { student: data }
    });
    dialogRef.afterClosed().subscribe(response => {
      var isBlocked = dialogRef.componentInstance.isBlock;
      if (isBlocked) {
        this.examList[index]['studentList']['data'][rowIndex]['status'] = 5;
        this.examList[index]['studentList']['data'][rowIndex]['timeLeft'] = { leftTime: 0 };
      }
      
    this.refresh()
    })
  }

  Submit(type: string, examIndex?: number, rowIndex?: any, examId?: number, data?: object,examData?:any): void {
    var title = type == 'student' ? "Do you want to submit exam for this student?" : type == 'exam' ? "Do you want to submit all students in this exam?" : "Do you want to submit all exams?";
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '40%',
      data: { title: title }
    })
    dialogRef.afterClosed().subscribe(response => {
      var isSubmit = dialogRef.componentInstance.isSubmit;
      if (isSubmit) {
        var body;
        if (type == 'student') {
          body = {
            studentExamDetails: [this.examList[examIndex]['studentList']['data'][rowIndex]]
              .map(({ studentSystemId, examStudentId, examTableId, ...rest }) =>
                ({ std_sys_id: studentSystemId, exam_student_id: examStudentId, exam_id: examTableId, ...rest }))
          }
          body.studentExamDetails.forEach(element => {
            element.exam_type= examData.exam_type;
          }); 
        }
        else if (type == 'exam') {
          body = {
            studentExamDetails: this.examList[examIndex]['studentList']['data']
              .map(({ studentSystemId, examStudentId, examTableId, ...rest }) =>
                ({ std_sys_id: studentSystemId, exam_student_id: examStudentId, exam_id: examTableId, ...rest }))
              .filter(f => (f.isVerified == 1 && f.status != 6))
          }
          body.studentExamDetails.forEach(element => {
            element.exam_type= examData.exam_type;
          }); 
        }
        else if (type == 'all') {
          var studentList = [];
          this.examList.forEach(element => {
            studentList = studentList.concat(element['studentList']['data']
              .map(({ studentSystemId, examStudentId, examTableId, ...rest }) =>
                ({ std_sys_id: studentSystemId, exam_student_id: examStudentId, exam_id: examTableId, ...rest }))
              .filter(f => (f.isVerified == 1 && f.status != 6)));
          });
          body = {
            studentExamDetails: studentList
          }
          body.studentExamDetails.forEach(element => {
            element.exam_type= examData.exam_type;
          }); 
        }
        try {
          this.ngxLoader.start();

          this.service.SubmitExam(body).subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              
              this.SaveFunctionalitiesOnTable(type, examIndex, rowIndex);

              this.ngxLoader.stop();
              // this.refresh()
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
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
    })
  }

  SaveFunctionalitiesOnTable(type: string, examIndex?: number, rowIndex?: number): void {
    if (type == 'student') {
      this.examList[examIndex]['studentList']['data'][rowIndex]['status'] = 6;
      this.examList[examIndex]['studentList']['data'][rowIndex]['timeLeft'] = { leftTime: 0 };
      var isSingleExamsDone = this.examList[examIndex]['studentList']['data'].filter(f => f.isVerified == 1)
        .every(d => d.status == 6);
      if (isSingleExamsDone) {
        this.examList[examIndex]['studentList']['data'] = this.examList[examIndex]['studentList']['data']
          .map(({ status, isVerified, ...rest }) => ({ status: isVerified == 1 ? 6 : status, isVerified, ...rest }));
      }
      var allExamsDone;
      this.examList.forEach(element => {
        allExamsDone = element['studentList']['data']
          .filter(f => f.isVerified == 1)
          .every(e => e.status == 6);
      })
      if (allExamsDone) {
        this.masterSubmitValid = false;
        this.ExamSummary();
      }
    }
    else if (type == 'exam') {
      this.examList[examIndex]['studentList']['data'] = this.examList[examIndex]['studentList']['data']
        .map(({ status, isVerified, timeLeft, ...rest }) =>
          ({ status: isVerified == 1 ? 6 : status, isVerified, timeLeft: isVerified == 1 ? { leftTime: 0 } : timeLeft, ...rest }));
     
      var allExamsDone;
      this.examList.forEach(element => {
        allExamsDone = element['studentList']['data']
          .filter(f => f.isVerified == 1)
          .every(e => e.status == 6);
      })
      if (allExamsDone){
        this.masterSubmitValid = false;
        this.ExamSummary();
      }
    }
    else if (type == 'all') {
      this.examList.forEach((element, examIndex) => {
        element['studentList']['data'] = element['studentList']['data']
          .map(({ status, isVerified, timeLeft, ...rest }) =>
            ({ status: isVerified == 1 ? 6 : status, isVerified, timeLeft: isVerified == 1 ? { leftTime: 0 } : timeLeft, ...rest }));

      });

      this.masterSubmitValid = false;
      this.ExamSummary();
    }
  }

  SingleStudentVerification(data: object, index: number, rowIndex: number): void {// stepper 1
    var rowData = Object.assign({}, data);

    const dialogRef = this.dialog.open(InvigilatorPageStudentVerificationPopupComponent, {
      width: '45%',
      height: '90%',
      data: { student: rowData, exam: this.examList[index] }
    })
    dialogRef.afterClosed().subscribe(response => {
      var submit = dialogRef.componentInstance.isSubmit;
      if (submit) {
        this.refresh()
        this.CheckSingleStudentVerification(dialogRef.componentInstance.data.student['verified'], index, rowIndex);
        // this.lateComerObservable = setInterval(() => {
          if(!this.isProctored){
            this.LateComersTimeConfiguration();
          }
        // }, 1000);
      }
    })
  }

  CheckSingleStudentVerification(verified: boolean, index: number, rowIndex: number): void {
    try {
      this.ngxLoader.start();
      this.examList[index]['studentList']['data'][rowIndex]['isVerified'] = verified;

      setTimeout(() => {
        this.examList[index]['studentList']['data'].paginator = this.paginator.toArray()[index];
        this.examList[index]['studentList']['data'].sort = this.sort.toArray()[index];
      }, 10);
      this.ngxLoader.stop();
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  LateComersTimeConfiguration(): void {
    try {
      // this.ngxLoader.start();
      this.service.LateComerTimeConfig().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          var copy = response.data.studentList.map(d => Object.assign({}, d));
          var mergeAll = [];
          copy.forEach(element => {
            mergeAll = mergeAll.concat(element.studentList);
          });
          mergeAll.forEach(data => {
            if (data.isExamStarted == 1 && this.examList.length > 0) {
              var examIndex = this.examList.findIndex(e => e['examTableId'] == data.examId);
              var rowIndex = this.examList[examIndex]['studentList']['data'].findIndex(st => st.examStudentId == data.examStudentId);
              if (this.examList[examIndex]['studentList']['data'][rowIndex]['timeLeft']['leftTime'] == 0) {
                this.examList[examIndex]['studentList']['data'][rowIndex]['timeLeft'] = { leftTime: data.timeLeft * 60 };
                this.examList[examIndex]['studentList']['data'][rowIndex]['status'] = data.status;
              }
            }
          });
          var isAllStarted = mergeAll.every(d => d.isExamStarted == 1);
          if ((mergeAll.length == 0 || !isAllStarted) && !this.islate ){
            this.LateComersTimeConfiguration();
          }
        }
      }, error => {
        this.LateComersTimeConfiguration();
        this.toastrService.error(error.message);
        // this.ngxLoader.stop();
      })
      // this.ngxLoader.stop();
    }
    catch (e) {
      this.LateComersTimeConfiguration();
      this.toastrService.error(e);
      // this.ngxLoader.stop();
    }
  }

  ExamSummary(): void{
    // this.router.navigate(['/initial']);
    const dialogRef = this.dialog.open(InvigilatorExamSummaryComponent, {
      width: '80%',
      height: '80%',
      disableClose: true
      // data: { }
    })
  }

  Reload(): void{
    // window.location.reload();
  }

  GoToInstructions(): void{
    sessionStorage.setItem('invigilatorinstruction', 'popup');
    this.dialog.open(InvigilatorInstructionPopupComponent,
      {
        width: '80%',
        height: '80%'
      });
  }

  EarlySubmitResponse(data: any,exam): void{
    data.exam_type=exam.exam_type;
    const dialogRef = this.dialog.open(InvigilatorEarlyExamResponsePopupComponent,
      {
        width: '35%',
        data: data
      });
      dialogRef.afterClosed().subscribe(response => {
       this.refresh()
      })
  }

  StudentPic(data: object, index: number, rowIndex: number){
const dialogRef = this.dialog.open(RandomImagePopupComponent,
  {
    width: '80%',
    height: '80%',
    data: data
  });
  }

  ngOnDestroy() {
    // clearInterval(this.lateComerObservable);
    // clearInterval(this.lateComerObservableOnPageLoad);
    // clearInterval(this.allStudentsExamCompletedInterval);
  }
  refresh(){
    this.router.navigateByUrl('landing/invigilator/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['landing/invigilator/examstart']);
  });
  }
   
}
