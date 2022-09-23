import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule, MatIconModule, MatDialogModule],
  exports: [DialogComponent],
  entryComponents: [MatDialogModule],
})
export class DialogModule {}
