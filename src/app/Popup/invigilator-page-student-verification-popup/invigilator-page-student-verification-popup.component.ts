import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invigilator-page-student-verification-popup',
  templateUrl: './invigilator-page-student-verification-popup.component.html',
  styleUrls: ['./invigilator-page-student-verification-popup.component.scss']
})
export class InvigilatorPageStudentVerificationPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<InvigilatorPageStudentVerificationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService,
    private service: ControllerAPIService) { }

  isSubmit: boolean = false;
  imgComparison: boolean = false;
  imgVerified: boolean = false;
  isProctored:any;
  studData:any;

  studDetails:any;
  examDetails:any;
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  ngOnInit() {
    
    this.isProctored=JSON.parse(sessionStorage.getItem("isProctored"))
    if(this.isProctored){
      this.ngxLoader.start()
      try {
        
        this.service.ExaminationInfoForVerifiedStudents().subscribe(response => {
          if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
            this.dataService.LogOut();
          }
          else if (response.success) {
            this.ngxLoader.stop()
          this.studData=response.data.studentList[0].studentList
          var studentData = this.studData.filter(s =>
            (s['examStudentId'] == this.data.student.examStudentId ) 
          );
          console.log(studentData)
          this.data.student.verifiedImage=studentData[0].verifiedImage
          console.log(this.data.student)
          }
          else {
            this.ngxLoader.stop()
            this.toastrService.error(response.message);
          }
        }, error => {
          this.ngxLoader.stop()
          this.toastrService.error(error.message);
        })
      }
      catch (e) {
        this.ngxLoader.stop()
        this.toastrService.error(e);
      }
    }
   

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  Submit(): void {
    try {
      this.ngxLoader.start();
      var body = {
        verified: this.data.student['verified'],
        examStudentId: this.data.student['examStudentId']
      }
      this.service.SingleStudentVerification(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.isSubmit = true;
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

  ResetSnap(): void {
    this.webcamImage = null;
  }

  SnapDone(): void {
    this.imgComparison = true;
    try {
      this.ngxLoader.start();
      var body = {
        examStudentId: this.data.student.examStudentId,
        webCamImage: this.webcamImage['_imageAsDataUrl'].substring(23) // remove unwanted data from base64
      }
      this.service.studentFaceRecognition(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          if (response.data.isRecognised) {
            this.ngxLoader.stop();
            this.imgVerified = true;
          }
          else {
            this.toastrService.error(response.message);
            this.ngxLoader.stop();
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

  ResetSnapOnComparison(): void {
    this.webcamImage = null;
    this.imgComparison = false;
    this.imgVerified = false;
  }

  ImageVerified(): void {
    this.webcamImage = null;
    this.imgComparison = false;
    this.showWebcam = false;
    // this.data.student.verified = true;
  }

  CancelWebCam(): void {
    this.webcamImage = null;
    this.imgComparison = false;
    this.showWebcam = false;
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
}
