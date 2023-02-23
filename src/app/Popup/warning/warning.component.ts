import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { interval } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ExamSummaryComponent } from 'src/app/Popup/exam-summary/exam-summary.component';
import {Subscriber,BehaviorSubject} from 'rxjs';
@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<WarningComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private toastrService: ToastrService,
    private router: Router, private ngxLoader: NgxUiLoaderService, private apiService: ExamAPIService,  private dialog: MatDialog) { }

  formCaption: string = "Enter the Key";
  lockForm: FormGroup;
  error: object = {
    required: "Please fill out this!"
  };
  
  payload:object;

  inputType: string = "abc";

  numKeyboard: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  lowerCaseCharactersKeyboard: any = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  upperCaseCharactersKeyboard: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  keyboardValue: any;

  upperCase: boolean = false;
  isRemaining:boolean;
  isshow:boolean =false;
  isProctored:boolean =false;
  Approval_Code:any;
  smpcount=this.dataService.smpcount1.value;
  smpover:boolean=false;
  public abc;

  ngOnInit() {
    console.log(this.data);
    if(this.data<0){
      this.isRemaining=false
    }
    else{
      this.isRemaining=true
    }
    
   this.smpcount=3;
    // if(this.smpcount == null){
    //   this.smpcount1.next(3);
    // }
    this.smpcount=this.dataService.smpcount1.value;;
    this.isshow= false;
    this.Approval_Code;``
    this.keyboardValue = this.numKeyboard;
    this.isProctored = JSON.parse(sessionStorage.getItem("isProctored"))

    if(this.isProctored)
      this.isshow= false;
    else
      this.isshow= true;
    
     console.log(this.Approval_Code);
    this.formSetup();
    
    this.ngxLoader.stopBackgroundLoader('loader-02')
  }

  formSetup(): void {
    this.lockForm = this.formBuilder.group({
      smpOtp: ['', [Validators.required]]
    })
    console.log(this.lockForm)
  }

  Submit(): void {
    try {
      if (this.lockForm.valid) {
        try {
          this.ngxLoader.start();
          this.apiService.UnlockStudentSMP(this.lockForm.value).subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              this.ngxLoader.stop();
              this.Approval_Code="";
              this.isshow = false;
              this.dataService.isNotLoginScreen.next(false);
              this.dataService.sideNavButton.next(false);
              this.dataService.warning.next(false);
              // this.dataService.toggleFullScreen();
              localStorage.removeItem('SMP');
              sessionStorage.removeItem('studentExamStart');
              this.dialogScreen.close();
              this.toastrService.success(response.message);
              sessionStorage.setItem('instruction', 'normal');
              // this.router.navigate(['/landing/student']);
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
      else {
        this.toastrService.error("Mandatory data missing!");
      }
    }
    catch (e) {
      this.toastrService.error(e.message);
    }
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

  InputChange(value: string, event: any): void {
    this.lockForm.controls['smpOtp'].setValue(this.lockForm.value.smpOtp + value);
  }

  LowerUperCaseChange(value: string): void {
    this.upperCase = !this.upperCase;
    if (!this.upperCase) {
      this.keyboardValue = this.lowerCaseCharactersKeyboard;
    }
    else if (this.upperCase) {
      this.keyboardValue = this.upperCaseCharactersKeyboard;
    }
  }

  Space(): void {
    this.lockForm.controls['smpOtp'].setValue(this.lockForm.value.smpOtp + ' ');
  }

  Backspace(): void {
    if (this.lockForm.value.smpOtp)
      this.lockForm.controls['smpOtp'].setValue(this.lockForm.value.smpOtp.slice(0, -1));
  }

  Clear(): void{
    this.lockForm.controls['smpOtp'].setValue('');
  }

  ResetMenu(): void{
    this.keyboardValue = this.numKeyboard;
    this.upperCase = false;
    this.inputType = "abc";
  }
  SMPCodeFetch(){
    
    try {
      
      this.payload = {
        "examStudentId":sessionStorage.getItem("examStudentId")
      }
      this.ngxLoader.start();
      this.apiService.SMPCodeFetch(this.payload).subscribe(response => {
         if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.ngxLoader.stop();
          this.dialogScreen.close();
          this.dataService.LogOut();
         
        }
         
        else if (response.success) {
          this.dataService.smpcount1.next(response.data.remainingCount);
          this.smpcount=this.dataService.smpcount1.value;
         
          if((+response.data.remainingCount >=1 && response.data.isSmpStatus == false)){
            
            if (this.abc instanceof Subscriber ) {
              this.abc.unsubscribe();
            }
            
          this.ngxLoader.stop();
          this.Approval_Code = response.data.smpCode;
          this.isshow=true;
          
          // console.log(response)
        
          }
          else{
            this.smpover=true;
            this.abc= interval(1000).subscribe(x => { // will execute every 1 seconds
              this.apiService.SMPCodeFetch(this.payload).subscribe(data =>{
                
               if(data.errorCode && (data.errorCode == this.data.unAuthorizedCode)){
                 this.dataService.LogOut();
               }
               else if (data.success){
                this.dataService.smpcount1.next(data.data.remainingCount);
                this.smpcount=this.dataService.smpcount1.value;
               if(data.data.isSmpStatus === true){
                // console.log("jiehi");
                 this.abc.unsubscribe();
                 this.dialogScreen.close();
                 this.dialog.closeAll();
                   this.router.navigate(['/initial']);
                   this.dialog.open(ExamSummaryComponent,
                     {
                       minWidth: '35%',
                       disableClose: true
                     });
                 
               
               } else if(+data.data.remainingCount >=1 ){
                this.dataService.smpcount1.next(data.data.remainingCount);
                this.smpcount=this.dataService.smpcount1.value;
                this.smpover=false;
                  this.abc.unsubscribe();
                
              this.ngxLoader.stop();
              this.Approval_Code = data.data.smpCode;
              this.isshow=true;
              
              // console.log(response)
            
              }
            }
             } );
            
           });
          }
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
