import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CANDIDATE_TAB_TYPE } from "../utils/candidate.const";
import { CandidateService, FirebaseCandidateFormat } from "../candidate.service";
import { Observable, tap } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-update-candidate",
  templateUrl: "./update-candidate.component.html",
  styleUrls: ["./update-candidate.component.scss"],
})
export class UpdateCandidateComponent implements OnInit {

  type = CANDIDATE_TAB_TYPE.CREATE;
  candidateId: string = "";
  candidate$: Observable<FirebaseCandidateFormat>;
  candidateFormGroup: FormGroup;

  constructor(private route: ActivatedRoute, private candidatesService: CandidateService) {
  }

  ngOnInit(): void {
    this.type = this.route.snapshot.params["type"];
    this.candidateId = this.route.snapshot.queryParams["id"];
    this.candidate$ = this.candidatesService.getCandidateById(this.candidateId).pipe(tap(console.log));

    this.candidateFormGroup = new FormGroup<any>({
      name: new FormControl(""),
      employeeId: new FormControl(""),
      account: new FormControl(""),
      dob: new FormControl(new Date()),
      gender: new FormControl("male"),
      university: new FormControl(""),
      faculty: new FormControl(""),
      phone: new FormControl(""),
      email: new FormControl(""),
      status: new FormControl(""),
      skill: new FormControl(""),
      language: new FormControl(""),
      id: new FormControl(""),
      note: new FormControl(""),
      history: new FormControl(""),
      level: new FormControl(""),
      graduateYear: new FormControl(new Date()),
      applicationDate: new FormControl(new Date())
    });
  }

  get isCreate(): boolean {
    return this.type === CANDIDATE_TAB_TYPE.CREATE;
  }

}
