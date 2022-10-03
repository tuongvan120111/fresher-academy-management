import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CandidatesComponent } from "./candidates/candidates.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { UpdateCandidateComponent } from "./update-candidate/update-candidate.component";
import { TableCandidateComponent } from "./table-candidate/table-candidate.component";
import { MatTabsModule } from "@angular/material/tabs";
import { CandidateDetailComponent } from "./update-candidate/candidate-detail/candidate-detail.component";
import { CandidateService } from "./candidate.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { CDropDownComponent } from "./components/c-drop-down/c-drop-down.component";
import { MatCardModule } from "@angular/material/card";
import { MatRadioModule } from "@angular/material/radio";
import { MatDividerModule } from "@angular/material/divider";
import { ClickOutSideDirective } from "./utils/directives/click-out-side.directive";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "candidates",
  },
  {
    path: "candidates/:type",
    component: UpdateCandidateComponent,
  },
  {
    path: "candidates",
    component: TableCandidateComponent,
  },
];

@NgModule({
  declarations: [
    CandidatesComponent,
    UpdateCandidateComponent,
    TableCandidateComponent,
    CandidateDetailComponent,
    CDropDownComponent,
    ClickOutSideDirective
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatDividerModule,
  ],
  providers: [CandidateService, { provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class CandidateManagementModule {
}
