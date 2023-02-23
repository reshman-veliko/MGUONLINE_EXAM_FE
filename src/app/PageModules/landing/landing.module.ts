import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponentContainer } from './landing-container';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { DeviceDetectorModule } from 'ngx-device-detector';


@NgModule({
  declarations: [
    LandingComponentContainer
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    AngularMaterial,
    DeviceDetectorModule.forRoot(),
  ]
})
export class LandingModule { }
