import { ControllerLoginComponent } from 'src/app/Components/controller-login/controller-login.component';
import { ControllerDashboardComponent } from 'src/app/Components/ControllerContainer/controller-dashboard/controller-dashboard.component';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';
import { ControllerInstructionsComponent } from 'src/app/Components/ControllerContainer/controller-instructions/controller-instructions.component';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';
import { ControllerStartExamComponent } from 'src/app/Components/ControllerContainer/controller-start-exam/controller-start-exam.component';

import { ControllerRefreshComponent } from 'src/app/Components/ControllerContainer/controller-refresh/controller-refresh.component';

import { InvigilatorSMPPopupComponent } from 'src/app/Popup/invigilator-smp-popup/invigilator-smp-popup.component';
import { ConfirmationPopupComponent } from 'src/app/Popup/confirmation-popup/confirmation-popup.component';
import { InvigilatorExamSummaryComponent } from 'src/app/Popup/invigilator-exam-summary/invigilator-exam-summary.component';
import { InvigilatorInstructionPopupComponent } from 'src/app/Popup/invigilator-instruction-popup/invigilator-instruction-popup.component';
import { InvigilatorEarlyExamResponsePopupComponent } from 'src/app/Popup/invigilator-early-exam-response-popup/invigilator-early-exam-response-popup.component';
import { RandomImagePopupComponent } from 'src/app/Popup/random-image-popup/random-image-popup.component';

export const ControllerLoginComponentContainer = [
    ControllerLoginComponent, 
    ControllerDashboardComponent, 
    InvigilatorOTPPopupComponent, 
    ControllerInstructionsComponent,
    InvigilatorPageStudentVerificationPopupComponent,
    ControllerStartExamComponent,
    InvigilatorSMPPopupComponent,
    ConfirmationPopupComponent,
    InvigilatorExamSummaryComponent,
    InvigilatorInstructionPopupComponent,
    InvigilatorEarlyExamResponsePopupComponent,
    RandomImagePopupComponent,
    ControllerRefreshComponent
];