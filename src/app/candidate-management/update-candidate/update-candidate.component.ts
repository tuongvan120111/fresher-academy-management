import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CANDIDATE_TAB_TYPE } from "../utils/candidate.const";
import { CandidateService, FirebaseCandidateFormat } from "../candidate.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-update-candidate",
  templateUrl: "./update-candidate.component.html",
  styleUrls: ["./update-candidate.component.scss"],
})
export class UpdateCandidateComponent implements OnInit {

  type = CANDIDATE_TAB_TYPE.CREATE;
  candidateId: string = "";
  candidate$: Observable<FirebaseCandidateFormat>;

  constructor(private route: ActivatedRoute, private candidatesService: CandidateService) {
  }

  ngOnInit(): void {
    this.type = this.route.snapshot.params["type"];
    this.candidateId = this.route.snapshot.queryParams["id"];
    this.candidate$ = this.candidatesService.getCandidateById(this.candidateId);
  }

  get isCreate(): boolean {
    return this.type === CANDIDATE_TAB_TYPE.CREATE;
  }

}
