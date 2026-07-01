

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
//////////////////// Confirmation Dialog ////////////////////
 
@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title align="center">{{ data.title || 'Confirm' }}</h2>
    <mat-dialog-content>
      <p>{{ data.message || 'Are you sure?' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" (click)="onNoClick()">No</button>
      <button mat-raised-button color="primary" (click)="onYesClick()">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string }
  ) {}
 
  onYesClick(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}


//////////////////// OK Dialog ////////////////////
 
@Component({
  selector: 'app-ok-dialog',
  template: `
    <h2 mat-dialog-title align="center">{{ data.title || 'Notice' }}</h2>
    <mat-dialog-content>
      <p>{{ data.message || 'Task Completed.' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="onOkClick()">OK</button>
    </mat-dialog-actions>
  `
})
export class AlertPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string }
  ) {}
 
  onOkClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'details-alert-popup',
  template: `
    <h2 mat-dialog-title align="center">{{ data.title || 'Notice' }}</h2>
    <mat-dialog-content>
      <table *ngIf="isObject(data.message)">
  <tr *ngFor="let key of objectKeys(data.message)">
    <th align="left">{{ key }}:</th>
    <td style="padding-left: 50px;">{{ data.message[key]}}</td>
  </tr>
</table>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="onOkClick()">OK</button>
    </mat-dialog-actions>
  `
})
export class DetailsAlertPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<DetailsAlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {
    title: string;
    message: { [key: string]: any }; // <--- Add this type
    }
  ) {}
 
  onOkClick(): void {
    this.dialogRef.close();
  }

  objectKeys(obj: { [key: string]: any }): string[] {
  return obj ? Object.keys(obj) : [];
}

  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }
}