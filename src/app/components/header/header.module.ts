import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogSizeSModule } from '../dialog-size-s/dialog-size-s.module';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    DialogSizeSModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
