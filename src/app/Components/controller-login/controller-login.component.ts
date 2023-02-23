import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/Services/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'app-controller-login',
  templateUrl: './controller-login.component.html',
  styleUrls: ['./controller-login.component.scss']
})
export class ControllerLoginComponent implements OnInit, AfterViewInit {

  constructor(private formbuilder: FormBuilder, private dataService: DataService, private ngxLoader: NgxUiLoaderService,
    private toastrService: ToastrService, private service: ControllerAPIService,
    private auth: ControllerAuthService, private router: Router, private dialog: MatDialog) { }

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

  showPass: boolean = false;
  passIcon: string = "visibility_off";

  // captchaValid: boolean = false;

  loginForm: FormGroup;
  loginFormCaption = {
    caption1: "Email",
    caption2: "Password"
  };
  loginFormData = {
    email: ['', [Validators.required, Validators.pattern(this.dataService.PATTERN.email)]],
    password: ['', [Validators.required]]
  };
  ERROR = {
    required: "Please fill out this!",
    emailPattern: "Please enter valid email!"
  };

  ngOnInit() {
    // this.addRecaptchaScript();
    this.loginForm = this.formbuilder.group(this.loginFormData);
  }

  ngAfterViewInit() {
  }

  togglePass() {
    this.showPass = !this.showPass;
    if (this.showPass)
      this.passIcon = "visibility";
    else
      this.passIcon = "visibility_off";
  };

  Submit(): void {
    try {
      this.ngxLoader.start();
      if (this.loginForm.valid) {
        var body = Object.assign({devType:"w" }, this.loginForm.value);
        body['password'] = sha512.sha512(this.loginForm.value.password);
        this.service.ControllerLogin(body).subscribe(response => {
          if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
            this.dataService.LogOut();
          }
          else if (response.success) {
            this.dataService.controllerData.next({
              email: response.data.email,
              userId: response.data.userId,
              sessionId: response.data.sessionId
            });
            this.ngxLoader.stop();
            this.OpenOTPPopup(response.data.email, response.data.userId, response.data.sessionId,response.data.isProctored);
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
      else if (this.loginForm.invalid) {
        this.toastrService.error("Mandatory data missing!");
        this.ngxLoader.stop();
      }
      // else if (!this.captchaValid) {
      //   this.toastrService.error("Captcha not valid!");
      //   this.ngxLoader.stop();
      // }
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  OpenOTPPopup(email: string, userId: string, sessionId: string,isProctored:boolean): void {
    const dialogRef = this.dialog.open(InvigilatorOTPPopupComponent, {
      minWidth: '20%'
    })
    dialogRef.afterClosed().subscribe(response => {
      var isSubmit = dialogRef.componentInstance.isSubmit;
      var otp = dialogRef.componentInstance.otpForm.value.otp;
      if (isSubmit)
        this.CheckOTP(otp, email, userId, sessionId,isProctored);
    })
  }

  // addRecaptchaScript() {
  //   window['grecaptchaCallback'] = () => {
  //     this.renderReCaptcha();
  //   }

  //   (function (d, s, id, obj) {
  //     var js, fjs = d.getElementsByTagName(s)[0];
  //     // if (d.getElementById(id)) { return; }
  //     js = d.createElement(s); js.id = id;
  //     js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
  //     fjs.parentNode.insertBefore(js, fjs);
  //   }(document, 'script', 'recaptcha-jssdk', this));

  // }

  // renderReCaptcha() {
  //   window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
  //     'sitekey': this.dataService.captchaSecretKey,
  //     'callback': (response) => {
  //       // response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
  //       var body = {
  //         response: response
  //       }
  //       try {
  //         this.ngxLoader.start();
  //         this.service.RecaptchaVerification(body).subscribe(response => {
  //           if (response){
  //             this.captchaValid = true;
  //             this.ngxLoader.stop();
  //           }
  //           else {
  //             this.toastrService.error(response.message);
  //             this.ngxLoader.stop();
  //           }
  //         }, error => {
  //           this.toastrService.error(error.message);
  //           this.ngxLoader.stop();
  //         })
  //       }
  //       catch (e) {
  //         this.toastrService.error(e);
  //         this.ngxLoader.stop();
  //       }
  //     },
  //     'expired-callback': (response) => {
  //       this.dialog.closeAll();
  //       this.captchaValid = false;
  //       this.ngxLoader.stop();
  //     }
  //   });
  // }

  CheckOTP(otp: number, email: string, userId: string, sessionId: string,isProctored:any): void {
    try {
      this.ngxLoader.start();
      var body = {
        verificationCode: otp
      }
      this.service.CheckOTP(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.dataService.controllerLogin.next(true);
          this.auth.controllerLoginAuth();
          this.ngxLoader.stop();

          sessionStorage.setItem("email", email);
          sessionStorage.setItem("userId", userId);
          sessionStorage.setItem("sessionId", sessionId);
          sessionStorage.setItem("isProctored", isProctored);
          sessionStorage.setItem("loginUser", 'invigilator');
          sessionStorage.setItem('invigilatorinstruction', 'normal');
          this.router.navigate(["/landing/invigilator/instruction"]);
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


}
