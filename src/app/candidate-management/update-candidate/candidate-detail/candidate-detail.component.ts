import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseCandidateFormat } from "../../candidate.service";
import { FormGroup } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "app-candidate-detail",
  templateUrl: "./candidate-detail.component.html",
  styleUrls: ["./candidate-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateDetailComponent implements OnInit, OnChanges {
  @Input()
  candidate: FirebaseCandidateFormat;

  @Input()
  candidateForm: FormGroup;

  maxDate = moment(new Date()).format("YYYY-MM-DD")

  constructor(private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    console.log(this.candidate, "<== candidate");
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setValue();
  }

  goBack() {
    this.router.navigate(["candidate-management"]);
  }

  setValue() {
    if(this.candidate) {
      console.log(moment(this.candidate.dob).format("YYYY-MM-DD"))
      console.log(this.candidate.dob.toISOString())
      this.candidateForm.patchValue({
        name: this.candidate.name,
        email: this.candidate.email,
        dob: moment(this.candidate.dob).format("YYYY-MM-DD"),
        university: this.candidate.university,
        phone: this.candidate.phone,
        skill: this.candidate.skill,
        account: this.candidate.account,
        level: this.candidate.level,
        graduateYear: moment(this.candidate.graduateYear).format("YYYY-MM-DD"),
        applicationDate: moment(new Date()).format("YYYY-MM-DD")
      })
    }
  }

  get dob() {
    return moment(this.candidate.dob).format("YYYY-MM-DD")
  }
}
