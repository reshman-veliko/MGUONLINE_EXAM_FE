import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';


@Component({
  selector: 'app-controller-dashboard',
  templateUrl: './controller-dashboard.component.html',
  styleUrls: ['./controller-dashboard.component.scss']
})
export class ControllerDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private auth: ControllerAuthService, private service: ControllerAPIService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService,
    private dataService: DataService, private router: Router, private formbuilder: FormBuilder,
    private dialog: MatDialog) {
  }

  private popoverTitleSubmitStepper1: string = 'Do you verified all students?';
  private popoverMessageSubmitStepper1: string = 'Please confirm this only when all the students gets verified';

  private popoverTitleSubmitStepper2: string = 'Are you sure to start exam?';

  isProctored:any;
  examDetails: Array<any>;// stepper 1
  displayedColumns: any; 
  headerCaption: any; 

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();// stepper 1
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();// stepper 1
  @ViewChildren('myPaginator') studentListPaginator: QueryList<ElementRef>;// stepper 1

  studentAssignmentExamDetails: Array<object>;// stepper 2
  studentAssignmentColumns: any; 
  studentAssignmentCaption: any; 

  @ViewChildren('studentAssignmentPaginatorSize') studentAssignmentListPaginator: QueryList<ElementRef>;// stepper 2

  freeSystems: Array<string>;// stepper 1

  // allocatedSystems: Array<boolean> = []// stepper 1


  stepper1Valid: boolean = false;
  stepper2Valid: boolean = false;

  questionShuffled: string = "false";

  questionCountValid: boolean = false;

  private pageInitInterval: any = null;
  private stepperInterval: any = null;
  private submitInterval: any = null;

  ngOnInit() {
    this.isProctored=JSON.parse(sessionStorage.getItem("isProctored"))
    if(!this.isProctored){
      this.displayedColumns= ['sno', 'name', 'hallTicketNumber', 'systemNo', 'action'];// stepper 1
      this.headerCaption= JSON.parse(JSON.stringify({// stepper 1
        caption1: "S/No",
        caption2: "Name",
        caption3: "Hall TicketNo",
        caption4: "System No",
        caption5: "Action"
      }))

      this.studentAssignmentColumns = ['sno', 'name', 'hallTicketNumber', 'systemNo', 'qpCode', 'status', 'verified'];// stepper 2
      this.studentAssignmentCaption = JSON.parse(JSON.stringify({// stepper 1
        caption1: "S/No",
        caption2: "Name",
        caption3: "Hall TicketNo",
        caption4: "System No",
        caption5: "Question Pattern",
        caption6: "Student Status",
        caption7: "Verified"
      }))
    }
    else{
      this.displayedColumns= ['sno', 'name', 'hallTicketNumber', 'phoneNumber'];// stepper 1
      this.headerCaption= JSON.parse(JSON.stringify({// stepper 1
        caption1: "S/No",
        caption2: "Name",
        caption3: "Hall TicketNo",
        caption4: "Phone Number"
      }))

      this.studentAssignmentColumns = ['sno', 'name', 'hallTicketNumber', 'phoneNumber', 'status', 'verified'];// stepper 2
      this.studentAssignmentCaption = JSON.parse(JSON.stringify({// stepper 1
        caption1: "S/No",
        caption2: "Name",
        caption3: "Hall TicketNo",
        caption4: "Phone Number",
        caption5: "Student Status",
        caption6: "Verified"
      }))

    }
    window.onpopstate = function (e) { window.history.forward(); }
  }

  ngAfterViewInit() {
    this.FetchStudents();// stepper 1
    this.questionShuffled = sessionStorage.getItem('questionShuffled');
  }

  FetchStudents(): void {// stepper 1
    try {
      this.ngxLoader.start();
      this.service.ExaminationInfo().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.examDetails = response.data.examDetails;
          this.examDetails = this.examDetails.map(({ verified, shuffleCount, ...rest }) => (
            {
              verified: verified == 1 ? true : false,
              shuffleCount: shuffleCount == null ? '' : shuffleCount,
              ...rest
            }));
          this.Stepper1FetchStudentTableRefresh();
          this.Stepper1Verification();// stepper 1
          this.QuestionCountValidCheck();// stepper 1
          // if (this.questionShuffled == 'true') {// Stepper 2
          if(this.isProctored){
            // this.FetchStudentAssignment();
            this.callVerifyStudentAfter20s()
          }
          else{
            if(this.examDetails[0]['examVerified'] == 1){
              // this.pageInitInterval = setInterval(() => {
                // this.FetchStudentAssignment();
                this.callVerifyStudentAfter20s()
              // }, 3600)
            }
          }
         
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

  Stepper1FetchStudentTableRefresh(): void {// stepper 1
    this.examDetails.forEach((element, index) => {
      element['studentList'] = element['studentList'].map(({ verified, ...rest }) => ({ verified: verified == 1 ? true : false, ...rest }));
      element['studentList'] = new MatTableDataSource<any>(element['studentList']);
      setTimeout(() => {
        element['studentList'].paginator = this.paginator.toArray()[index];
        element['studentList'].sort = this.sort.toArray()[index];
      }, 10);
    });
  }

  applyFilter(filterValue: string, index: number) {// stepper 1
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.examDetails[index]['studentList'].filter = filterValue;
  }

  Stepper1Verification(): void {// stepper 1
    var validFalse = this.examDetails.some(d => d['verified'] == false);
    if (validFalse)
      this.stepper1Valid = false;
    else
      this.stepper1Valid = true;
  }

  NextToStepper2(): void {
    // this.stepperInterval = setInterval(() => {
      // this.FetchStudentAssignment();
      this.callVerifyStudentAfter20s()
    // }, 3600)
  }

  SubmitStepper1(): void {// stepper 1
    try {
      this.ngxLoader.start();
      var tableWithRemovedMatTableSource = this.dataService.RemoveMatTableSource(this.examDetails, ['studentList']);

      var body = {
        examList: tableWithRemovedMatTableSource.map(({ e_id, shuffleCount,ExamType }) => ({ e_id: e_id, shuffleCount: parseInt(shuffleCount),exam_type:ExamType }))
      }
      body.examList.forEach(element => {
        if(element.exam_type=="23"){
          element.shuffleCount=0;
        }
      });
      
      body = Object.assign(body, this.dataService.controllerData.value);
      this.service.SubmitAllExams(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.FetchStudents();
          // this.submitInterval = setInterval(() => {
            // this.FetchStudentAssignment();
            this.callVerifyStudentAfter20s()
          // }, 3600)
          this.ngxLoader.stop();
          this.questionShuffled = "true";
          sessionStorage.setItem('questionShuffled', 'true');
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

  SingleStudentVerification(data: object, index: number, rowIndex: number): void {// stepper 1
    var rowData = Object.assign({}, data);

    const dialogRef = this.dialog.open(InvigilatorPageStudentVerificationPopupComponent, {
      width: '45%',
      height: '90%',
      data: { student: rowData, exam: this.examDetails[index], duration: this.examDetails[index].duration }
    })
    dialogRef.afterClosed().subscribe(response => {
      var submit = dialogRef.componentInstance.isSubmit;
      if (submit) {
        this.CheckSingleStudentVerification(dialogRef.componentInstance.data.student['verified'], index, rowIndex);
      }
    })
  }

  CheckSingleStudentVerification(verified: boolean, index: number, rowIndex: number): void {//stepper1
    try {
      this.ngxLoader.start();
      this.examDetails[index]['studentList']['data'][rowIndex]['verified'] = verified;
      var isAllVerified = this.examDetails[index]['studentList']['data'].every(s => s.verified == true);
      if (isAllVerified)
        this.examDetails[index]['verified'] = true;
      this.Stepper1Verification();
      setTimeout(() => {
        this.examDetails[index]['studentList']['data'].paginator = this.paginator.toArray()[index];
        this.examDetails[index]['studentList']['data'].sort = this.sort.toArray()[index];
      }, 10);
      this.ngxLoader.stop();
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  QuestionCountValidCheck(): void {// stepper 1
    
    if(this.examDetails.find(r => r['ExamType'] == 23)){
      this.questionCountValid = true;
    }else{
      var valid = this.examDetails.every(r => r['shuffleCount'] != "");
      if (valid)
        this.questionCountValid = true;
      else
        this.questionCountValid = false;
    }
    
  }

  //=============Stepper 2 section started========================//

  applyFilterStudentAssignment(filterValue: string, index: number) {// stepper 2
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.studentAssignmentExamDetails[index]['studentList'].filter = filterValue;
  }

  FetchStudentAssignment(): void {// stepper 2
    try {
      this.service.ExaminationInfoForVerifiedStudents().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.studentAssignmentExamDetails = response.data.studentList;
          this.Stepper2FetchStudentTableRefresh();
          this.ngxLoader.stop();
          var statusHold = [];
          if(this.isProctored){
            this.stepper2Valid = true;
            this.studentAssignmentExamDetails.forEach(masterElement => {
              if (masterElement['studentList']['data']) {
                var studentStatusCheck = masterElement['studentList']['data'].map(s =>
                  (s['status'] == 'online' && (s['isVerified'] == true || s['faceRecognitionStatus'] == true)) 
                );
              }
              else {
                var studentStatusCheck = masterElement['studentList'].map(s =>
                  (s['status'] == 'online' && (s['isVerified'] == true || s['faceRecognitionStatus'] == true))
                );
              }
              statusHold.push(studentStatusCheck)
            });
          var validAny=(statusHold[0].includes(true));
            var valid = statusHold[0].every(s => s == true);
            if (validAny) {
              // this.stepper2Valid = true;
              if(!valid){
                // this.FetchStudentAssignment()
                this.callVerifyStudentAfter20s()
              }
              // clearInterval(this.pageInitInterval);
              // clearInterval(this.stepperInterval);
              // clearInterval(this.submitInterval);
            }
            else {
              // this.stepper2Valid = false;
              // this.FetchStudentAssignment()
              this.callVerifyStudentAfter20s()
            }
          }
          else{

          
          this.studentAssignmentExamDetails.forEach(masterElement => {
            if (masterElement['studentList']['data']) {
              var studentStatusCheck = masterElement['studentList']['data'].every(s =>
                (s['status'] == 'online' && s['isVerified'] == true) ||
                (s['isVerified'] == false)
              );
            }
            else {
              var studentStatusCheck = masterElement['studentList'].every(s =>
                (s['status'] == 'online' && s['isVerified'] == true) ||
                (s['isVerified'] == false)
              );
            }
            statusHold.push(studentStatusCheck)
          });
          var valid1 = statusHold.every(s => s == true);
          if (valid1) {
            this.stepper2Valid = true;
            // clearInterval(this.pageInitInterval);
            // clearInterval(this.stepperInterval);
            // clearInterval(this.submitInterval);
          }
          else {
            this.stepper2Valid = false;
            // this.FetchStudentAssignment()
            this.callVerifyStudentAfter20s()
          }
        }
          
         
        }
        else {
          // this.FetchStudentAssignment()
          this.callVerifyStudentAfter20s()
          this.toastrService.error(response.message);
        }
      }, error => {
        // this.FetchStudentAssignment()
        this.callVerifyStudentAfter20s()
        this.toastrService.error(error.message);
      })
    }
    catch (e) {
      // this.FetchStudentAssignment()
      this.callVerifyStudentAfter20s()
      this.toastrService.error(e);
    }
  }

  StudentAssignmentSingleStudentVerification(data: object, index: number, rowIndex: number): void {// stepper 2
    var rowData = Object.assign({}, data);
    rowData['verified'] = rowData['isVerified'];
    const dialogRef = this.dialog.open(InvigilatorPageStudentVerificationPopupComponent, {
      width: '45%',
      height: '90%',
      data: { student: rowData, exam: this.studentAssignmentExamDetails[index] }
    })
    dialogRef.afterClosed().subscribe(response => {
      var submit = dialogRef.componentInstance.isSubmit;
      if (submit) {
        this.refresh()

        this.StudentAssignmentCheckSingleStudentVerification(dialogRef.componentInstance.data.student['verified'], index, rowIndex);
      }
    })
  }

  StudentAssignmentCheckSingleStudentVerification(verified: boolean, index: number, rowIndex: number): void {//stepper2
    try {
      this.ngxLoader.start();
      this.studentAssignmentExamDetails[index]['studentList']['data'][rowIndex]['isVerified'] = verified;

      setTimeout(() => {
        this.studentAssignmentExamDetails[index]['studentList']['data'].paginator = this.paginator.toArray()[index];
        this.studentAssignmentExamDetails[index]['studentList']['data'].sort = this.sort.toArray()[index];
      }, 10);
      this.ngxLoader.stop();
      // this.FetchStudentAssignment()
      this.callVerifyStudentAfter20s()
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  Stepper2FetchStudentTableRefresh(): void {// stepper 2
    this.studentAssignmentExamDetails.forEach((element, index) => {
      element['studentList'] = element['studentList'].map(({ status, isVerified, ...rest }) => (
        {
          status: status == 1 ? 'offline' : status == 2 ? 'online' : status,
          isVerified: isVerified == 1 ? true : false,
          ...rest
        }))
      element['studentList'] = new MatTableDataSource<any>(element['studentList']);
      setTimeout(() => {
        element['studentList'].paginator = this.paginator.toArray()[this.examDetails.length + index];
        element['studentList'].sort = this.sort.toArray()[this.examDetails.length + index];
      }, 1000);
    });
  }

  SubmitStepper2(): void {// stepper 2
    try {
      this.ngxLoader.start();
      var body = {
        examList: this.studentAssignmentExamDetails.map(d => {return {e_id: d['e_id']}})
      }
      
      this.service.InvigilatorStartExam(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          sessionStorage.setItem('controllerExamStart', 'true');
          this.router.navigate(['landing/invigilator/examstart']);
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

  ngOnDestroy() {
    // clearInterval(this.pageInitInterval);
    // clearInterval(this.stepperInterval);
    // clearInterval(this.submitInterval);
  }

  refresh(){
    this.router.navigateByUrl('landing/invigilator/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['landing/invigilator/dashboard']);
  });
  }
  callVerifyStudentAfter20s() {
    setTimeout(()=>
    { 
      this.FetchStudentAssignment();
  }, 20000);
  }
}
