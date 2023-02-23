import { Component, OnInit, Inject, AfterViewInit,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hallticket-popup',
  templateUrl: './hallticket-popup.component.html',
  styleUrls: ['./hallticket-popup.component.scss'],
  providers: [
    DatePipe
  ]
})
export class HallticketPopupComponent implements OnInit, AfterViewInit {

  constructor(private dialogScreen: MatDialogRef<HallticketPopupComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastrService: ToastrService, private formBuilder: FormBuilder,
    private service: StudentLoginAPIService, private ngxLoader: NgxUiLoaderService, private datePipe: DatePipe) { }

  maxDate: Date = new Date();

  formCaption = {
    caption1: "Enter your hallticket number",
    caption2: "Choose your Date of Birth"
  };
  hallticketForm: FormGroup;
  error = {
    required: "Please fill out this!"
  };
  submit: boolean = false;

  studentData: any;

  inputType: string = "abc";

  numKeyboard: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  lowerCaseCharactersKeyboard: any = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  upperCaseCharactersKeyboard: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  keyboardValue: any;

  upperCase: boolean = false;

  ngOnInit() {
    this.keyboardValue = this.numKeyboard;
    this.formSetup();
  }

  ngAfterViewInit() {
    var today = new Date();
    var currentYear = today.getFullYear();
    var minimizedYear = currentYear - 15;
    this.maxDate = new Date("12-31-" + minimizedYear);
  }

  formSetup(): void {
    this.hallticketForm = this.formBuilder.group({
      hallTicketNumber: ['', [Validators.required]],
      birthDate: ['', [Validators.required]]
    })
  }

  Submit(): void {
    try {
      this.ngxLoader.start();
      // this.ngxLoader.startBackgroundLoader('loader-02')
      var body = this.hallticketForm.value;
      body['birthDate'] = this.datePipe.transform(this.hallticketForm.value.birthDate, "yyyy-MM-dd");
      if (this.hallticketForm.valid) {
        this.service.hallTicketVerification(this.hallticketForm.value).subscribe(response => {
          if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
            this.dataService.LogOut();
          }
          else if (response.success) {
            this.studentData = response;
            this.dataService.studentCredentials.next({
              examStudentId: response.data.examStudentId
            })
            this.dataService.studentData.next(response.data)
            sessionStorage.setItem('Token', response.data.token);
            sessionStorage.setItem('examStudentId', response.data.examStudentId);
            sessionStorage.setItem('isProctored', response.data.isProctored);
            this.submit = true;
            this.ngxLoader.stop();
            this.dialogScreen.close();
          }
          else {
            this.toastrService.error(response.message);
            // this.ngxLoader.stopBackgroundLoader('loader-02')
            this.ngxLoader.stop();
          }
        }, error => {
          this.toastrService.error(error.message);
          this.ngxLoader.stop();
        })
      }
      else {
        this.toastrService.error("Mandatory data missing!");
        this.ngxLoader.stop();
      }
    }
    catch (e) {
      this.toastrService.error("Mandatory data missing!");
      this.ngxLoader.stop();
    }
  }


  _keyPress(event: any) {
    this.dataService.NumberOnly(event);
  }

  KeyboardTypeChange(): void {
    if (this.inputType == "abc") {
      this.upperCase = false;
      this.inputType = "123";
      this.keyboardValue = this.lowerCaseCharactersKeyboard;
    }
    else if (this.inputType == "123") {
      this.inputType = "abc";
      this.keyboardValue = this.numKeyboard;
    }
  }

  InputChange(value: string) {
    this.hallticketForm.controls['hallTicketNumber'].setValue(this.hallticketForm.value.hallTicketNumber + value);
  }

  LowerUperCaseChange(): void {
    this.upperCase = !this.upperCase;
    if (!this.upperCase) {
      this.keyboardValue = this.lowerCaseCharactersKeyboard;
    }
    else if (this.upperCase) {
      this.keyboardValue = this.upperCaseCharactersKeyboard;
    }
  }

  Space(): void {
    this.hallticketForm.controls['hallTicketNumber'].setValue(this.hallticketForm.value.hallTicketNumber + ' ');
  }

  Backspace(): void {
    if (this.hallticketForm.value.hallTicketNumber)
      this.hallticketForm.controls['hallTicketNumber'].setValue(this.hallticketForm.value.hallTicketNumber.slice(0, -1));
  }

  Clear(): void{
    this.hallticketForm.controls['hallTicketNumber'].setValue('');
  }

  ResetMenu(): void{
    this.keyboardValue = this.numKeyboard;
    this.upperCase = false;
    this.inputType = "abc";
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

}
