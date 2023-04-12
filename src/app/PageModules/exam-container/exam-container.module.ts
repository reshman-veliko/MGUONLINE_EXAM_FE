import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamContainerRoutingModule } from './exam-container-routing.module';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { ExamComponentContainer } from './exam-component-container';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CountdownModule } from 'ngx-countdown';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { ExamSummaryComponent } from 'src/app/Popup/exam-summary/exam-summary.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { StudentInstructionPopupComponent } from 'src/app/Popup/student-instruction-popup/student-instruction-popup.component';
import { StudentEarlyExamSubmitPopupComponent } from 'src/app/Popup/student-early-exam-submit-popup/student-early-exam-submit-popup.component';
import { WebcamModule } from 'ngx-webcam';

import { ConfirmPopupComponent } from 'src/app/Popup/confirm-popup/confirm-popup.component';
import { CancelPopupComponent } from 'src/app/Popup/cancel-popup/cancel-popup.component';
import { UploadQuestionComponent } from 'src/app/Popup/upload-question/upload-question.component';
import { ExamPauseComponent } from 'src/app/Popup/exam-pause/exam-pause.component';

@NgModule({
  declarations: [
    ExamComponentContainer
  ],
  imports: [
    CommonModule,
    AngularMaterial,
    CountdownModule,
    ExamContainerRoutingModule,
    WebcamModule,
    DeviceDetectorModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  entryComponents: [WarningComponent, ExamSummaryComponent, StudentInstructionPopupComponent,
  StudentEarlyExamSubmitPopupComponent,CancelPopupComponent,UploadQuestionComponent,ExamPauseComponent,
  ConfirmPopupComponent]
})
export class ExamContainerModule { }
