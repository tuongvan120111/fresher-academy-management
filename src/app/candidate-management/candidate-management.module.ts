import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesComponent } from './candidates/candidates.component';
import { Route, RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: CandidatesComponent }];

@NgModule({
  declarations: [CandidatesComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CandidateManagementModule {}
