import { Component, OnInit, Inject, AfterViewInit,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';

@Component({
  selector: 'app-random-image-popup',
  templateUrl: './random-image-popup.component.html',
  styleUrls: ['./random-image-popup.component.scss']
})
export class RandomImagePopupComponent implements OnInit,AfterViewInit {

  constructor(private dialogScreen: MatDialogRef<RandomImagePopupComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private service: ControllerAPIService,
    private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService) { }
    result: any;
    isImage:boolean=false;
  ngOnInit() {
  }

  ngAfterViewInit(){
    try {
      this.ngxLoader.start();
      var body = this.dataService.controllerData.value;
      body["examStudentId"] = this.data.examStudentId;
      this.service.StudentRandonImage(body).subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.result = response.data.studentImages;
          this.result['name']=this.data.name
          this.result['hallTicketNumber']=this.data.hallTicketNumber
          this.ngxLoader.stop();
          this.isImage=false
        }
        else {
          this.isImage=true
          // this.toastrService.error(response.message);
          this.ngxLoader.stop();
        }
      }, error => {
        this.isImage=true
        // this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.toastrService.error(e.message);
      this.ngxLoader.stop();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

}
