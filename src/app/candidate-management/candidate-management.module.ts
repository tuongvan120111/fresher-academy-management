import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CandidatesComponent} from './candidates/candidates.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {UpdateCandidateComponent} from './update-candidate/update-candidate.component';
import {TableCandidateComponent} from './table-candidate/table-candidate.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CandidateDetailComponent } from './update-candidate/candidate-detail/candidate-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'candidates'
  },
  {
    path: 'candidates/:type',
    component: UpdateCandidateComponent
  },
  {
    path: 'candidates',
    component: TableCandidateComponent,
  },
];

@NgModule({
  declarations: [CandidatesComponent, UpdateCandidateComponent, TableCandidateComponent, CandidateDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MatButtonModule, MatIconModule, MatTabsModule],
})
export class CandidateManagementModule {
}
