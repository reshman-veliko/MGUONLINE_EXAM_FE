import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ControllerAuthService } from './controller-auth.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private auth: ControllerAuthService, private router: Router, private ngxLoader: NgxUiLoaderService) {
  }

  public PATTERN = {
    email: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$",
    mobilePattern: '[6-9]\\d{9}',
    telephonePattern: '\\s*(?:\\+?\\d{1,3})?[- (]*\\d{3}(?:[- )]*\\d{3})?[- ]*\\d{1,6}(?: *[x/#]\\d+)?\\s*$'
  }

  public encrypetionToken = "DASTP@mgu@*1234*";
  public smpcount1 = new BehaviorSubject<any>(null);

  //common

  public sideNav = new BehaviorSubject<boolean>(true);

  public sideNavButton = new BehaviorSubject<boolean>(false);

  //Invigilator

  public controllerLogin = new BehaviorSubject<boolean>(false);

  public controllerData = new BehaviorSubject<any>(null);

  public captchaSecretKey = '6LcQosIUAAAAAL7Nz-WSiW1EgrxmvPDHEnKdGAM9';

  //student

  public studentCredentials = new BehaviorSubject<any>({});

  public studentData = new BehaviorSubject<any>(null);

  public warning = new BehaviorSubject<boolean>(null);

  public isNotLoginScreen = new BehaviorSubject<boolean>(false);

  public questionFetch = new BehaviorSubject<boolean>(false);

  public questionsData = new BehaviorSubject<any>([]);
  
  public imageDetails = new BehaviorSubject<any>("");
  public examType = new BehaviorSubject<any>("");

  public earlySubmitData = new BehaviorSubject<boolean>(false);

  public timer = new BehaviorSubject<number>(null);

  public examStartAndTimer = new BehaviorSubject<any>(null);

  public unAuthorizedCode: number = 1001;


  toggleFullScreen() {
    
    let elem = docElmWithBrowsersFullScreenFunctions;
    let methodToBeInvoked = elem.requestFullscreen ||
      elem.webkitRequestFullscreen || elem['mozRequestFullscreen'] ||
      elem['msRequestFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  NumberOnly(event: any) {
    const pattern = /^[0-9]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

    }
  }


  playAudio(){
    let audio = new Audio();
    audio.src = "../../../assets/mp3/click.mp3";
    audio.load();
    audio.play();
  }

  RemoveMatTableSource(tableSource: any, tableSourceField: Array<string>): any {
    var table = Object.assign([], tableSource);

    tableSourceField.forEach(elementField => {
      table.forEach(element => {
        element[elementField] = element[elementField]['data'];
      });
    });

    return table;
  }

  shuffle(array: any): any {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  LogOut(): void{
    var loginType = sessionStorage.getItem('loginUser');
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("AcceptInstruction");
    sessionStorage.removeItem("questionShuffled");
    sessionStorage.removeItem('controllerExamStart');
    sessionStorage.removeItem("loginUser");
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("studentData");
    sessionStorage.removeItem("questionFetch");
    sessionStorage.removeItem("studentSubjectSpecificInstruction");
    sessionStorage.removeItem("examStudentId");
    sessionStorage.removeItem("studentCommonInstruction");
    sessionStorage.removeItem('studentExamStart');
    sessionStorage.removeItem("isProctored");
    sessionStorage.removeItem("imageVerified");
    this.controllerLogin.next(false);
    this.controllerData.next(null);
    this.auth.controllerLogoutAuth();
    if (loginType == 'invigilator') {
      window.location.reload();
      // this.router.navigateByUrl('landing/invigilator/refresh', { skipLocationChange: true }).then(() => {
      //   this.router.navigate(['landing/invigilator/login']);
    // });
      
      // window.location.reload();
    }
    else {
      this.studentCredentials.next({});
      this.studentData.next({});
      this.router.navigate(["/landing/student/initial"]);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 10);
    }
  }

}

const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
  mozRequestFullScreen(): Promise<void>;
  webkitRequestFullscreen(): Promise<void>;
  msRequestFullscreen(): Promise<void>;
};

