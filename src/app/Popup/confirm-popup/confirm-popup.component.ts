import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<ConfirmPopupComponent>,
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
