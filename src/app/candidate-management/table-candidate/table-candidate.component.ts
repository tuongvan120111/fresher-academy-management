import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CANDIDATE_TAB_TYPE } from "../utils/candidate.const";

@Component({
  selector: "app-table-candidate",
  templateUrl: "./table-candidate.component.html",
  styleUrls: ["./table-candidate.component.scss"],
})
export class TableCandidateComponent implements OnInit {
  isSelectedAll: boolean = false;
  cols = ["#",
    "Empl ID",
    "Account",
    "Name",
    "DOB",
    "Gender",
    "University",
    "Faculty",
    "Phone",
    "Email",
    "Status"];

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  toggleSelected() {
    this.isSelectedAll = !this.isSelectedAll;
  }

  navigateToCreate() {
    this.router.navigate([CANDIDATE_TAB_TYPE.CREATE], { relativeTo: this.route });
  }

  navigateToUpdate(id: string) {
    this.router.navigate([CANDIDATE_TAB_TYPE.UPDATE], { relativeTo: this.route, queryParams: { id } });
  }
}
