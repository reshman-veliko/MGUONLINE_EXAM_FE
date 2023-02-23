import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonPanelComponent } from 'src/app/Components/ExamContainer/common-panel/common-panel.component';
import { CommonInstructionsComponent } from 'src/app/Components/ExamContainer/common-instructions/common-instructions.component';
import { SubjectSpecificInstructionComponent } from 'src/app/Components/ExamContainer/subject-specific-instruction/subject-specific-instruction.component';
import { ExamStartComponent } from 'src/app/Components/ExamContainer/exam-start/exam-start.component';
import { MarkListComponent } from 'src/app/Components/ExamContainer/mark-list/mark-list.component';


const routes: Routes = [
  {path: "", component: CommonPanelComponent, children: [
    {path: "commoninstructions", component: CommonInstructionsComponent},
    {path: "subjectspecificinstructions", component: SubjectSpecificInstructionComponent},
    {path: "progress", component: ExamStartComponent},
    {path: "marklist", component: MarkListComponent},
    { path: '', redirectTo: 'commoninstructions', pathMatch: 'full' },
    { path: '**', redirectTo: 'commoninstructions', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamContainerRoutingModule { }
