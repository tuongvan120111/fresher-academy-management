import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassManagementComponent } from './class-management.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ClassManagementComponent }
]

@NgModule({
  declarations: [
    ClassManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ClassManagementModule { }
