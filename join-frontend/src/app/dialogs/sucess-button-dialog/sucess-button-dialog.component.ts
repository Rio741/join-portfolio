import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sucess-button-dialog',
  imports: [],
  templateUrl: './sucess-button-dialog.component.html',
  styleUrl: './sucess-button-dialog.component.scss'
})
export class SucessButtonDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SucessButtonDialogComponent>
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
