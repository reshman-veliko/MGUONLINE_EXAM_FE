import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {   ViewChild, ElementRef, HostListener, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-cancel-popup',
  templateUrl: './cancel-popup.component.html',
  styleUrls: ['./cancel-popup.component.scss']
})
export class CancelPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<CancelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  isSubmit: boolean = false;

  ngOnInit() {
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  Submit(): void{
    this.isSubmit = true;
    this.dialogScreen.close();
  }
}
