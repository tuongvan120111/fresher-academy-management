import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CandidatesComponent} from './candidates/candidates.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

const routes: Routes = [{path: '', component: CandidatesComponent}];

@NgModule({
  declarations: [CandidatesComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MatButtonModule, MatIconModule],
})
export class CandidateManagementModule {
}
