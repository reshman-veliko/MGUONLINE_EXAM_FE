import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { Routing } from './Master Modules/routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { InvigilatorInterceptor } from './Components/Interceptors/InvigilatorInterceptor';
import { DeviceDetectorModule } from 'ngx-device-detector';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Routing,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    DeviceDetectorModule.forRoot(),
    NgxUiLoaderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InvigilatorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
