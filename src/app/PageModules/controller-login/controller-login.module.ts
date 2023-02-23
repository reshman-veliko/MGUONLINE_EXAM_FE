import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControllerLoginRoutingModule } from './controller-login-routing.module';
import { ControllerLoginComponentContainer } from './controller-login-container';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';
import { WebcamModule } from 'ngx-webcam';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { CountdownModule } from 'ngx-countdown';
import { InvigilatorSMPPopupComponent } from 'src/app/Popup/invigilator-smp-popup/invigilator-smp-popup.component';
import { ConfirmationPopupComponent } from 'src/app/Popup/confirmation-popup/confirmation-popup.component';
import { InvigilatorExamSummaryComponent } from 'src/app/Popup/invigilator-exam-summary/invigilator-exam-summary.component';
import {NgxPrintModule} from 'ngx-print';
import { InvigilatorInstructionPopupComponent } from 'src/app/Popup/invigilator-instruction-popup/invigilator-instruction-popup.component';
import { InvigilatorEarlyExamResponsePopupComponent } from 'src/app/Popup/invigilator-early-exam-response-popup/invigilator-early-exam-response-popup.component';
import { RandomImagePopupComponent } from 'src/app/Popup/random-image-popup/random-image-popup.component';

@NgModule({
  declarations: [
    ControllerLoginComponentContainer
  ],
  imports: [
    CommonModule,
    ControllerLoginRoutingModule,
    AngularMaterial,
    WebcamModule,
    CountdownModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    NgxPrintModule
  ],
  entryComponents: [InvigilatorOTPPopupComponent,
    InvigilatorPageStudentVerificationPopupComponent,
    InvigilatorSMPPopupComponent,
    ConfirmationPopupComponent,
    InvigilatorExamSummaryComponent,
    InvigilatorInstructionPopupComponent,
    InvigilatorEarlyExamResponsePopupComponent,
    RandomImagePopupComponent
  ],
})
export class ControllerLoginModule { }
