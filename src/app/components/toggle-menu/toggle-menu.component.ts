import { Component, OnInit } from '@angular/core';
import { ListRoleuser, RoleUser } from 'src/app/shared/constants/common.constants';
import { SelectedItem } from 'src/app/shared/models/common.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { MenuEnum } from './toggle-menu.constants';

@Component({
  selector: 'app-toggle-menu',
  templateUrl: './toggle-menu.component.html',
  styleUrls: ['./toggle-menu.component.scss']
})
export class ToggleMenuComponent implements OnInit {
  MenuEnum = MenuEnum;
  selectedItem: MenuEnum = MenuEnum.Dashboard;
  dataSourceRoles: SelectedItem[] = []
  isLogged!: boolean;

  private readonly userRoles: RoleUser[] = ListRoleuser

  constructor(private commonSer: CommonService) { }

  ngOnInit(): void {
    this.commonSer.loginSignal$.subscribe((isLogged: boolean) => {
      if (isLogged) {
        const userLogin = this.commonSer.getCurrentUser();
        if (userLogin) {
          this.isLogged = userLogin.isLogged
        }
      } else {
        this.isLogged = false;
      }
    })

    const userLogin = this.commonSer.getCurrentUser();
    if (userLogin) {
      this.isLogged = userLogin.isLogged
    }


    this.dataSourceRoles = this.userRoles.map((role: RoleUser) => {
      return {
        id: role.toString(),
        name: this.commonSer.getRoleUserString(role),
        isDisable: false
      }
    })
  }

}
