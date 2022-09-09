import { Component, OnInit } from "@angular/core";
import { Route, Router } from "@angular/router";
import {
  ListRoleuser,
  RoleUser,
} from "src/app/shared/constants/common.constants";
import { SelectedItem } from "src/app/shared/models/common.model";
import { CommonService } from "src/app/shared/services/common.service";
import { MenuEnum } from "./toggle-menu.constants";

@Component({
  selector: "app-toggle-menu",
  templateUrl: "./toggle-menu.component.html",
  styleUrls: ["./toggle-menu.component.scss"],
})
export class ToggleMenuComponent implements OnInit {
  MenuEnum = MenuEnum;
  selectedItem: MenuEnum = MenuEnum.Dashboard;
  dataSourceRoles: SelectedItem[] = [];
  private readonly userRoles: RoleUser[] = ListRoleuser;

  constructor(private commonSer: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.dataSourceRoles = this.userRoles.map((role: RoleUser) => {
      return {
        id: role.toString(),
        name: this.commonSer.getRoleUserString(role),
        isDisable: false,
      };
    });
  }

  navigate() {
    this.router.navigate(["/candidate-management"]);
  }
}
