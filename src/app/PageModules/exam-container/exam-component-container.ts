
import { CommonInstructionsComponent } from 'src/app/Components/ExamContainer/common-instructions/common-instructions.component';
import { CommonPanelComponent } from 'src/app/Components/ExamContainer/common-panel/common-panel.component';
import { SubjectSpecificInstructionComponent } from 'src/app/Components/ExamContainer/subject-specific-instruction/subject-specific-instruction.component';
import { ExamStartComponent } from 'src/app/Components/ExamContainer/exam-start/exam-start.component';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { MarkListComponent } from 'src/app/Components/ExamContainer/mark-list/mark-list.component';
import { ExamSummaryComponent } from 'src/app/Popup/exam-summary/exam-summary.component';
import { StudentInstructionPopupComponent } from 'src/app/Popup/student-instruction-popup/student-instruction-popup.component';
import { CalculatorComponent } from 'src/app/Components/Calculator/calculator/calculator.component';
import { StudentEarlyExamSubmitPopupComponent } from 'src/app/Popup/student-early-exam-submit-popup/student-early-exam-submit-popup.component';
import { ConfirmPopupComponent } from 'src/app/Popup/confirm-popup/confirm-popup.component';
import { CancelPopupComponent } from 'src/app/Popup/cancel-popup/cancel-popup.component';
import { UploadQuestionComponent } from 'src/app/Popup/upload-question/upload-question.component';
export const ExamComponentContainer = [
    CommonInstructionsComponent, 
    CommonPanelComponent, 
    SubjectSpecificInstructionComponent,
    ExamStartComponent,
    WarningComponent,
    MarkListComponent,
    UploadQuestionComponent,
    ExamSummaryComponent,
    StudentInstructionPopupComponent,
    CalculatorComponent,
    StudentEarlyExamSubmitPopupComponent,
    ConfirmPopupComponent,
    CancelPopupComponent
];