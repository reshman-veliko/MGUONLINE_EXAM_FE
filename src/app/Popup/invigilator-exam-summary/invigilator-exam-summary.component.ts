import { Component, OnInit, Inject, AfterViewInit,HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { Router } from '@angular/router';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';

@Component({
  selector: 'app-invigilator-exam-summary',
  templateUrl: './invigilator-exam-summary.component.html',
  styleUrls: ['./invigilator-exam-summary.component.scss']
})
export class InvigilatorExamSummaryComponent implements OnInit, AfterViewInit {

  constructor(private formbuilder: FormBuilder, private dialogScreen: MatDialogRef<InvigilatorExamSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService,
    private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService,
    private service: ControllerAPIService, private router: Router, private auth: ControllerAuthService) { }

  summary: any;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.FetchSummary();
  }

  FetchSummary() {
    try {
      this.ngxLoader.start();
      this.service.ExamSummary().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {

          sessionStorage.removeItem("userId");
          sessionStorage.removeItem("sessionId");
          sessionStorage.removeItem("email");
          sessionStorage.removeItem("AcceptInstruction");
          sessionStorage.removeItem("questionShuffled");
          sessionStorage.removeItem('controllerExamStart');
          sessionStorage.removeItem("loginUser");
          sessionStorage.removeItem("Token");
          this.dataService.controllerLogin.next(false);
          this.dataService.controllerData.next(null);
          this.auth.controllerLogoutAuth();
          this.summary = response.data;
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

  Close(): void {
    this.dialogScreen.close();
    this.router.navigate(["/landing/invigilator/login"]);
    window.location.reload();
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
}
