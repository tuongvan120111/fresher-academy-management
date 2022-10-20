import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CANDIDATE_TAB_TYPE } from "../utils/candidate.const";
import { CandidateService } from "../candidate.service";
import { Observable, of, tap } from "rxjs";
import { ICandidate } from "../model/candidate.interface";

@Component({
  selector: "app-table-candidate",
  templateUrl: "./table-candidate.component.html",
  styleUrls: ["./table-candidate.component.scss"],
})
export class TableCandidateComponent implements OnInit {
  candidates$: Observable<ICandidate<Date, string>[]> = of([]);
  candidates = [];
  deleteCandidatesId: string[] = [];
  isSelectedAll: boolean = false;
  cols = [
    "#",
    "Empl ID",
    "Account",
    "Name",
    "DOB",
    "Gender",
    "University",
    "Faculty",
    "Phone",
    "Email",
    "Status",
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.candidateService.getCandidates();
    this.candidates$ = this.candidateService.candidateStore$.pipe(
      tap((candidates) => {
        this.candidates = candidates;
      })
    );
  }

  ngAfterViewInit() {}

  toggleSelected() {
    this.isSelectedAll = !this.isSelectedAll;
    this.candidates.forEach((candidate) => {
      if (!this.deleteCandidatesId.includes(candidate.id)) {
        this.deleteCandidatesId.push(candidate.id);
      }
    });
    if (!this.isSelectedAll) {
      this.deleteCandidatesId = [];
    }
    console.log(this.deleteCandidatesId);
  }

  toggleSelectedRow(i) {
    let index = this.deleteCandidatesId.findIndex(
      (id) => id === this.candidates[i].id
    );
    console.log(index);
    if (index === -1) {
      this.deleteCandidatesId.push(this.candidates[i]?.id);
    } else {
      this.deleteCandidatesId.splice(index, 1);
    }
    console.log(this.deleteCandidatesId);
  }

  navigateToCreate() {
    this.router.navigate([CANDIDATE_TAB_TYPE.CREATE], {
      relativeTo: this.route,
    });
  }

  navigateToUpdate(id: string) {
    this.router.navigate([CANDIDATE_TAB_TYPE.UPDATE], {
      relativeTo: this.route,
      queryParams: { id },
    });
  }

  deleteCandidate() {
    this.deleteCandidatesId.forEach((id) => {
      this.candidateService.deleteCandidate(id);
    });
    this.deleteCandidatesId = [];
  }
}
