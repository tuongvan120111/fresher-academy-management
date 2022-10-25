import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedItemComponent } from './selected-item.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SelectedItemComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    FormsModule
  ],
  exports: [SelectedItemComponent]
})
export class SelectedItemModule { }
