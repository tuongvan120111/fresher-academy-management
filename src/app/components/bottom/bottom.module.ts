import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomComponent } from './bottom.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    BottomComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    BottomComponent
  ]
})
export class BottomModule { }
