import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [SpinnerComponent],
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  exports: [SpinnerComponent],
})
export class SpinnerModule {}
