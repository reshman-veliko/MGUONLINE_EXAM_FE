import { Component, OnInit, Inject, AfterViewInit,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-invigilator-smp-popup',
  templateUrl: './invigilator-smp-popup.component.html',
  styleUrls: ['./invigilator-smp-popup.component.scss']
})
export class InvigilatorSMPPopupComponent implements OnInit, AfterViewInit {

  constructor(private dialogScreen: MatDialogRef<InvigilatorSMPPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService,
    private service: ControllerAPIService) { }

  studentDetails :any;

  isBlock: boolean = false;

  reason: any = new FormControl('', Validators.required);

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.StudentSMPCheck();
  }

  StudentSMPCheck(): void {
    try {
      this.ngxLoader.start();
      var body = this.dataService.controllerData.value;
      body["examStudentId"] = this.data.student.examStudentId;
      this.service.IndividualStudentSMPList(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response) {
          this.ngxLoader.stop();
          this.studentDetails = response.data.studentDetails[0];
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

  Close(): void{
    this.dialogScreen.close();
  }

  Block(): void{
    try {
      this.ngxLoader.start();
      var body = {
        examStudentId: this.data.student.examStudentId,
        smpReason: this.reason.value
      }
      this.service.StudentSMPBlock(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.ngxLoader.stop();
          this.isBlock = true;
          this.dialogScreen.close();
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
  allow(){
    try {
      this.ngxLoader.start();
      var body = {
        examStudentId: this.data.student.examStudentId,
        
      }
      this.service.StudentSMPAllow(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.toastrService.success(response.message);
          this.ngxLoader.stop();
          this.dialogScreen.close();
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

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
}
