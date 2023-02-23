import { Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {  OnInit, ViewChild, ElementRef, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  deviceInfo:any;
  isChrome:boolean=true;
  isMobile:boolean=false;
  isTab:boolean=false;
  title = 'DASP-EXAM';
  constructor( private deviceService: DeviceDetectorService) {
    this.epicFunction();
  }
  
  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTab = this.deviceService.isTablet();
    if(this.deviceInfo.browser=='Chrome'){
      this.isChrome=true
    }else{
      this.isChrome=false
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
}
