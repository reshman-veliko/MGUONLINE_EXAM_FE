import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControllerLoginComponent } from 'src/app/Components/controller-login/controller-login.component';
import { ControllerDashboardComponent } from 'src/app/Components/ControllerContainer/controller-dashboard/controller-dashboard.component';
import { ControllerLoginGuard } from 'src/app/Authguard/controller-login.guard';
import { ControllerInstructionsComponent } from 'src/app/Components/ControllerContainer/controller-instructions/controller-instructions.component';
import { ControllerStartExamComponent } from 'src/app/Components/ControllerContainer/controller-start-exam/controller-start-exam.component';
import { ControllerRefreshComponent } from 'src/app/Components/ControllerContainer/controller-refresh/controller-refresh.component';

const routes: Routes = [
  { path: 'login', component: ControllerLoginComponent },
  { path: 'instruction', component: ControllerInstructionsComponent, canActivate: [ControllerLoginGuard] },
  { path: 'dashboard', component: ControllerDashboardComponent, canActivate: [ControllerLoginGuard] },
  { path: 'examstart', component: ControllerStartExamComponent, canActivate: [ControllerLoginGuard] },
  { path: 'refresh', component: ControllerRefreshComponent },
  { path: '', redirectTo: 'login', pathMatch: "full" },
  { path: '**', redirectTo: 'login', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControllerLoginRoutingModule { }
