import { Component, OnInit } from '@angular/core';
import { HallticketAuthService } from 'src/app/Services/hallticket-auth.service';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {

  constructor(private auth: HallticketAuthService, private dataService: DataService) { }


  ngOnInit() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("email");
    this.dataService.controllerLogin.next(false);
    this.dataService.controllerData.next(null);
  }

}
