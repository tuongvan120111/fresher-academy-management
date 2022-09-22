import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassManagementComponent } from './class-management.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { ClassInformationComponent } from './class-information/class-information.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: ClassManagementComponent }];

@NgModule({
  declarations: [ClassManagementComponent, ClassInformationComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class ClassManagementModule {}
