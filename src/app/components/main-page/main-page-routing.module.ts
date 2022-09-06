import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('../../login/login.module').then(m => m.LoginModule) },
  { path: 'dashboard', loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'class-management', loadChildren: () => import('../../class-management/class-management.module').then(m => m.ClassManagementModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule { }