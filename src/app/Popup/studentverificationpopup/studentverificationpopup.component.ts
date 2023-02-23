import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-studentverificationpopup',
  templateUrl: './studentverificationpopup.component.html',
  styleUrls: ['./studentverificationpopup.component.scss']
})
export class StudentverificationpopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<StudentverificationpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService,
    private service: ControllerAPIService,private examService:ExamAPIService) { }

  isSubmit: boolean = false;
  imgComparison: boolean = false;
  imgVerified: boolean = false;
  isVerified:boolean=false;

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
    this.dataService.playAudio()
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
            this.isVerified=false;
            this.toastrService.success(response.message);
            sessionStorage.setItem("imageVerified","true")
            this.dialogScreen.close();
          }
          else {
            // this.toastrService.error(response.message);
            this.ngxLoader.stop();
            this.isVerified=true
            this.checkVerified()
          }
        }
        else {
          // this.toastrService.error(response.message);
          this.ngxLoader.stop();
          this.isVerified=true
          this.checkVerified()
          // this.dialogScreen.close();
        }
      }, error => {
        this.isVerified=true
        // this.toastrService.error(error.message);
        this.checkVerified()
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.isVerified=true
      this.checkVerified()
      // this.toastrService.error(e);
      // this.ngxLoader.stop();
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
  checkVerified(){
    try {
      this.ngxLoader.start();
      var body = {
        examStudentId: this.data.student.examStudentId,
       
      }
      this.examService.StudentStatusVerification(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          if (response.data.verifiedStatus) {
            this.ngxLoader.stop();
            this.imgVerified = true;
            this.isVerified=false;
            this.toastrService.success(response.message);
            sessionStorage.setItem("imageVerified","true")
            this.dialogScreen.close();
          }
          else {
            // this.toastrService.error(response.message);
            // this.ngxLoader.stop();
            this.isVerified=true
            this.checkVerified()
          }
        }
        else {
          // this.toastrService.error(response.message);
          // this.ngxLoader.stop();
          this.isVerified=true
          this.checkVerified()
          // this.dialogScreen.close();
        }
      }, error => {
        this.isVerified=true
        // this.toastrService.error(error.message);
        this.checkVerified()
        // this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.isVerified=true
      this.checkVerified()
      // this.toastrService.error(e);
      // this.ngxLoader.stop();
    }

  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

}
