import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { PrepareUserAccountService } from 'src/app/shared/services/prepare-user-account.service';
import { DialogSizeSComponent } from '../dialog-size-s/dialog-size-s.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title: string = 'FSOFT HR UTILITY';
  name!: string;
  buzUnit!: string;
  isLogged!: boolean;

  constructor(private commonSer: CommonService, private userSer: PrepareUserAccountService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.name = 'Tăng Tường Vân';
    this.buzUnit = 'FHM.CMS'
    this.commonSer.loginSignal$.subscribe((isLogged: boolean) => {
      if (isLogged) {
        const userLogin = this.commonSer.getCurrentUser();
        if (userLogin) {
          this.name = userLogin.fullName;
          this.buzUnit = userLogin.buzUnit;
          this.isLogged = userLogin.isLogged;
        }
      } else {
        this.name = null!;
        this.buzUnit = null!;
        this.isLogged = null!;
      }
    })

    const userLogin = this.commonSer.getCurrentUser();
    if (userLogin) {
      this.name = userLogin.fullName;
      this.buzUnit = userLogin.buzUnit;
      this.isLogged = userLogin.isLogged;
    }
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(DialogSizeSComponent, {
      width: '450px',
      data: { icon: ['power_settings_new'], title: 'Logout', message: 'Do you want to logout?', buttons: 'Ok' },
    })

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.userSer.logout();
        this.router.navigateByUrl('/login')
      }
    })


  }

}
