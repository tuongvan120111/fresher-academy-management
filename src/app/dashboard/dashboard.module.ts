import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SelectedItemModule } from '../components/selected-item/selected-item.module';
import { LocationsService } from '../shared/services/locations.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: DashboardComponent }
]

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SelectedItemModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  providers: [LocationsService]
})
export class DashboardModule { }
