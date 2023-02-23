import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { MatDialog } from '@angular/material';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-common-panel',
  templateUrl: './common-panel.component.html',
  styleUrls: ['./common-panel.component.scss']
})
export class CommonPanelComponent implements OnInit {

  constructor(private dataService: DataService, private deviceService: DeviceDetectorService,
    private toastrService: ToastrService, private apiService: ExamAPIService, private dialog: MatDialog,
    private router: Router, private ngxLoader: NgxUiLoaderService) { }

  // fullScr: boolean = false;
  // winHeight: number;

  ngOnInit() {
    // var SMP = localStorage.getItem('SMP');
    // if (SMP == 'true') {
    this.sendWarning();
    // }
    // this.fullScr = true;
    // this.winHeight = window.innerHeight;
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   event.returnValue = false;
  //   event.preventDefault();
  //   if (this.winHeight < window.innerHeight)
  //     this.winHeight = window.innerHeight;
  //   // var alreadyMarked = localStorage.getItem('SMP');
  //   // if (window.innerHeight != this.winHeight && alreadyMarked != 'true') {
  //     if (window.innerHeight != this.winHeight) {

  //     this.MarkSMP();
  //   }
  // }

  // @HostListener('contextmenu', ['$event'])
  // onRightClick(event) {
  //   event.preventDefault();
  // }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.returnValue = false;
    event.preventDefault();
    
  }

  // *mouse click event

  // @HostListener('document:click', ['$event'])
  // public documentClick(event: Event): void {
  //   this.fullScreen();
  // }

  // @HostListener('document:keydown', ['$event']) 
  // onKeydownHandler(event: KeyboardEvent) {
  //   event.returnValue = false;
  //   event.preventDefault();
  // }

  sendWarning(): void {
    try {
      this.apiService.CheckStudentSMP().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
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
          this.toastrService.error(response.message);
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

  // MarkSMP(): void {
  //   try {
  //     this.ngxLoader.start();
  //     // localStorage.setItem('SMP', 'true');
  //     this.dataService.warning.next(true);
  //     this.router.navigate(['/initial']);
  //     this.apiService.MarkStudentSMP().subscribe(response => {
  //       if (response.success) {
  //         this.ngxLoader.stop();
  //         this.toastrService.success(response.message);
  //         this.dialog.open(WarningComponent,
  //           {
  //             minWidth: '35%',
  //             disableClose: true
  //           });
  //       }
  //       else {
  //         this.toastrService.error(response.message);
  //       }
  //     }, error => {
  //       this.toastrService.error(error.message);
  //       this.ngxLoader.stop();
  //     })
  //   }
  //   catch (e) {
  //     this.toastrService.error(e);
  //     this.ngxLoader.stop();
  //   }
  // }

}
