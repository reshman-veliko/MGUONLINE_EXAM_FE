import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  isSubmit: boolean = false;

  ngOnInit() {
  }

  Close(): void{
    this.dialogScreen.close();
  }

  Submit(): void{
    this.isSubmit = true;
    this.dialogScreen.close();
  }


  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

}
