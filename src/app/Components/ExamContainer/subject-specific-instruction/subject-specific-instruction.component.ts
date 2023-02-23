import { Component, OnInit,HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { QuestionService } from 'src/app/Services/question.service';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-subject-specific-instruction',
  templateUrl: './subject-specific-instruction.component.html',
  styleUrls: ['./subject-specific-instruction.component.scss']
})
export class SubjectSpecificInstructionComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(public dataService: DataService, private router: Router, private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService, private apiService: StudentLoginAPIService,private dialog: MatDialog, private examService: ExamAPIService) { }

  user:any;
  checked:any;
  winHeight: number;
  subscription: Subscription;

  ngOnInit() {
    var data= this.dataService.examStartAndTimer.subscribe(response => {
      if(response){
        this.ngxLoader.stopBackgroundLoader('loader-02')
      }
      else{
        this.ngxLoader.startBackgroundLoader('loader-02')
        // this.isLoader()
      }
    }
    );
    
    sessionStorage.setItem('studentSubjectSpecificInstruction', 'true');
    this.subscription = this.dataService.studentData.subscribe(response => {
      if (response) {
        this.user = response;
      }
    })
    this.winHeight = window.innerHeight;
  }

  ngAfterViewInit() {
    
  }

  // isLoader(){
  //   this.dataService.examStartAndTimer.subscribe(response => {
  //     if(response){
  //       this.ngxLoader.stop()
  //     }
  //     else{
  //       this.ngxLoader.start()
  //       this.isLoader()
  //     }
  //   }
  //   );
  //   if(this.dataService.examStartAndTimer.value){
  //     if(this.dataService.examStartAndTimer.value.isProgress){
  //       this.ngxLoader.stop();
  //     }
  //     else{
  //       this.isLoader()
  //     }
      
  //   }else{
  //     this.isLoader()
  //   }
  // }
  Previous(): void {
    this.router.navigate(["/landing/student/exam/commoninstructions"]);
  }

  Proceed(): void {
    try {
      this.ngxLoader.start();
      this.apiService.StudentStartExam().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.dataService.toggleFullScreen();
          this.router.navigate(["/landing/student/exam/progress"]);
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
      // this.toastrService.error("Mandatory data missing!");
      this.ngxLoader.stop();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
     
     
      //this.MarkSMP();
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
