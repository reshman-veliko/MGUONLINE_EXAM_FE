import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HallticketAuthService } from 'src/app/Services/hallticket-auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HallticketPopupComponent } from 'src/app/Popup/hallticket-popup/hallticket-popup.component';
import { EncryptionService } from 'src/app/Services/encryption.service';
import { StudentverificationpopupComponent } from 'src/app/Popup/studentverificationpopup/studentverificationpopup.component';
@Component({
  selector: 'app-initial-student-login',
  templateUrl: './initial-student-login.component.html',
  styleUrls: ['./initial-student-login.component.scss']
})
export class InitialStudentLoginComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataService, private apiService: StudentLoginAPIService,
    private dialog: MatDialog, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router, private auth: HallticketAuthService, private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService, private encryptionService: EncryptionService) { }

  caption: any;
  studentData: any;
  int: any;
  isProctored:any;

  valid: boolean = false;

  ngOnInit() {
    // this.showPopup();
    // this.Interval();
    // this.dataService.studentData.next(null);
  }

  ngAfterViewInit() {
    
    this.isProctored=JSON.parse(sessionStorage.getItem('isProctored'))
    var studentData = sessionStorage.getItem('studentData');
    var imageVerified=JSON.parse(sessionStorage.getItem('imageVerified'))
    if (studentData) {
      var dec = this.encryptionService.decryptUsingAES256(studentData);
      this.studentData = JSON.parse(JSON.parse(dec));
      if(this.isProctored ){
        if(!imageVerified){
        this.SingleStudentVerification(this.studentData)
        }
      }
    }
    else
    
      this.EnterHallticket();
    this.loadData();
  }

  loadData(): void {
    this.caption = {
      examName: "Examination Name",
      examDate: "Examination Date",
      examTime: "Exam Time",
      programmeName: "Programme Name",
      batchName: "Batch Name",
      courseName: "Course Name",
      studentName: "Student Name",
      studyCentre: "Exam Centre",
      duration: "Exam Duration",
      hallTicketNumber: "Hall Ticket",
      studyCentreCode: "Exam Centre Code"
    };
  }

  Submit(): void {
    try {
      this.dataService.toggleFullScreen()
      sessionStorage.setItem('instruction', 'normal');
      this.auth.hallTicketValid();
      this.dataService.isNotLoginScreen.next(true);
      
      this.router.navigate(['/landing/student/exam/commoninstructions']);
      this.ngxLoader.stop();
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }


  EnterHallticket(): void {
    const dialog = this.dialog.open(HallticketPopupComponent,
      {
        minWidth: '25%',
        disableClose: true
      });
    dialog.afterClosed().subscribe(response => {
    
    
     
      this.valid = dialog.componentInstance.submit;
      if (this.valid) {
        

        var studentLoginResponse = dialog.componentInstance.studentData;
        this.toastrService.success(studentLoginResponse.message);
        this.studentData = studentLoginResponse.data.examInfo[0];
        var stringifyStudentData = JSON.stringify(this.studentData);
        var encryptedStudentData = this.encryptionService.encryptUsingAES256(stringifyStudentData);
        sessionStorage.setItem('studentData', encryptedStudentData);
        this.studentData["duration"] = this.studentData["duration"];
        this.dataService.studentData.next(this.studentData);
        sessionStorage.setItem("loginUser", 'student');
        this.isProctored=JSON.parse(sessionStorage.getItem('isProctored'))
        if(this.isProctored){
          this.SingleStudentVerification(this.studentData)
        }
      }
    }, error => {
      this.toastrService.error(error);
    })
  }
  SingleStudentVerification(data: object): void {// stepper 1
    var rowData = Object.assign({}, data);

    const dialogRef = this.dialog.open(StudentverificationpopupComponent, {
      width: '45%',
      height: '90%',
      disableClose: true,
      data: { student: rowData }
    })
    dialogRef.afterClosed().subscribe(response => {
      
     
    })
  }
}
