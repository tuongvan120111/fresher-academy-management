import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToggleMenuComponent } from "./toggle-menu.component";
import { MatIconModule } from "@angular/material/icon";
import { SelectedItemModule } from "../selected-item/selected-item.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [ToggleMenuComponent],
  imports: [CommonModule, MatIconModule, SelectedItemModule, RouterModule],
  exports: [ToggleMenuComponent],
})
export class ToggleMenuModule {}
