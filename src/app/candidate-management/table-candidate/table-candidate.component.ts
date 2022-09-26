import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CANDIDATE_TAB_TYPE } from "../utils/candidate.const";
import { CandidateService } from "../candidate.service";
import { Observable } from "rxjs";
import { ICandidate } from "../model/candidate.interface";

@Component({
  selector: "app-table-candidate",
  templateUrl: "./table-candidate.component.html",
  styleUrls: ["./table-candidate.component.scss"],
})
export class TableCandidateComponent implements OnInit {
  candidates$: Observable<ICandidate<Date, string>[]>;
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

  constructor(private router: Router, private route: ActivatedRoute, private candidateService: CandidateService) {
    this.candidates$ = this.candidateService.candidateStore$;
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
