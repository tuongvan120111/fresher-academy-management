import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { HeaderModule } from './components/header/header.module';
import { ToggleMenuModule } from './components/toggle-menu/toggle-menu.module';
import { BottomModule } from './components/bottom/bottom.module';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AuthGuard } from './auth/auth.guard';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  {
    path: '', component: MainPageComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
      { path: 'class-management', loadChildren: () => import('./class-management/class-management.module').then(m => m.ClassManagementModule), canActivate: [AuthGuard] },
    ]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // for firestore
    HeaderModule,
    ToggleMenuModule,
    BottomModule,
    RouterModule.forRoot(routes),
    HeaderModule,
    BottomModule,
    ToggleMenuModule,
    MatSnackBarModule,
    AngularFireStorageModule
    // AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
