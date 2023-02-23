import { Component, OnInit,HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-invigilator-instruction-popup',
  templateUrl: './invigilator-instruction-popup.component.html',
  styleUrls: ['./invigilator-instruction-popup.component.scss']
})
export class InvigilatorInstructionPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<InvigilatorInstructionPopupComponent>) { }

  ngOnInit() {
  }

  Close(): void{
    this.dialogScreen.close();
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
}
