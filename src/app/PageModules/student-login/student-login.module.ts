import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentLoginRoutingModule } from './student-login-routing.module';
import { StudentLoginComponentContainer } from './student-login-container';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { HallticketPopupComponent } from 'src/app/Popup/hallticket-popup/hallticket-popup.component';
import { StudentverificationpopupComponent } from 'src/app/Popup/studentverificationpopup/studentverificationpopup.component';
import { WebcamModule } from 'ngx-webcam';
@NgModule({
  declarations: [
    StudentLoginComponentContainer
  ],
  imports: [
    CommonModule,
    StudentLoginRoutingModule,
    AngularMaterial,
    WebcamModule
  ],
  entryComponents: [
    HallticketPopupComponent,
    StudentverificationpopupComponent
  ]
})
export class StudentLoginModule { }
