import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { ToastrService } from 'ngx-toastr';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-controller-instructions',
  templateUrl: './controller-instructions.component.html',
  styleUrls: ['./controller-instructions.component.scss']
})
export class ControllerInstructionsComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private auth: ControllerAuthService,
    private toastrService: ToastrService, private service: ControllerAPIService,
    private dataService: DataService) { }

    examFetchCompleted: boolean = false;

    showConfirmation: boolean = true;

  ngOnInit() {
    window.onpopstate = function (e) { window.history.forward(); }
  }

  ngAfterViewInit() {
    var instructionType = sessionStorage.getItem('invigilatorinstruction');
    if(instructionType == 'normal'){
      this.showConfirmation = true;
    try {
      this.service.ExamFetchFromMainServer().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          sessionStorage.setItem('Token', response.data.token);
          this.examFetchCompleted = true;
          if(response.data.isExamStarted){
            sessionStorage.setItem('AcceptInstruction', 'true');
            sessionStorage.setItem('controllerExamStart', 'true');
          this.router.navigate(['landing/invigilator/examstart']);
          }
        }
        else{
          this.toastrService.error(response.message);
          this.examFetchCompleted = false;
        }
      }, error => {
        this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.toastrService.error(e);
    }
  }
  else{
    this.showConfirmation = false;
  }
  }

  Accept(): void {
    sessionStorage.setItem('AcceptInstruction', 'true');
    this.auth.controllerLoginAuth();
    this.router.navigate(['landing/invigilator/dashboard']);
  }

}
