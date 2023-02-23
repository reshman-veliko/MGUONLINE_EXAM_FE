import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-student-instruction-popup',
  templateUrl: './student-instruction-popup.component.html',
  styleUrls: ['./student-instruction-popup.component.scss']
})
export class StudentInstructionPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<StudentInstructionPopupComponent>) { }

  ngOnInit() {
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.returnValue = false;
    event.preventDefault();
  }
  

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    event.returnValue = false;
    event.preventDefault();
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  Close(): void{
    this.dialogScreen.close();
  }

}
