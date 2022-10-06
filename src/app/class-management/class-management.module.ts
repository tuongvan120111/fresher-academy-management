import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { DialogModule } from '../components/dialog/dialog.module';
import { NewClassComponent } from './class-detail/class-detail.component';
import { ClassManagementComponent } from './class-management.component';
import { FooterButtonComponent } from './footer-button/footer-button.component';
import { ClassTableComponent } from './class-table/class-table.component';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
  { path: '', component: ClassTableComponent },
  { path: 'new-class', component: NewClassComponent },
  { path: ':id', component: NewClassComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  declarations: [
    ClassManagementComponent,
    NewClassComponent,
    ClassTableComponent,
    FooterButtonComponent,
  ],
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
    MatDialogModule,
    DialogModule,
    MatProgressBarModule,
    MatExpansionModule,
    RouterModule.forChild(routes),
  ],
  providers: [CurrencyPipe],
})
export class ClassManagementModule {}
