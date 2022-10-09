import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseCandidateFormat } from "../../candidate.service";
import { FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { IUniversity } from "../../services/university.service";
import { ISite } from "../../services/sites.service";
import { IChannel } from "../../services/channel.service";
import { IFaculty } from "../../services/faculty.service";

@Component({
  selector: "app-candidate-detail",
  templateUrl: "./candidate-detail.component.html",
  styleUrls: ["./candidate-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateDetailComponent implements OnInit, OnChanges {
  @Input()
  label: string;

  @Input()
  candidate: FirebaseCandidateFormat;

  @Input()
  candidateForm: FormGroup;

  @Input()
  universities: IUniversity[];

  @Input()
  sites: ISite[];

  @Input()
  channels: IChannel[];

  @Input()
  faculties: IFaculty[];

  @Output()
  onSubmit = new EventEmitter();


  maxDate = moment(new Date()).format("YYYY-MM-DD");

  constructor(private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    console.log(this.candidateForm.get("email"), "<== candidate");

  }

  ngOnChanges(changes: SimpleChanges) {
    this.setValue();
  }

  goBack() {
    this.router.navigate(["candidate-management"]);
  }

  setValue() {
    if (this.candidate) {
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
        applicationDate: moment(new Date()).format("YYYY-MM-DD"),
        language: this.candidate.language,
        channel: this.candidate.channel,
        gender: this.candidate.gender,
        faculty: this.candidate.faculty,
        note: this.candidate.note
      });
    }
  }

  get dob() {
    return moment(this.candidate.dob).format("YYYY-MM-DD");
  }

  onSiteChange(site: string) {
    this.candidateForm.patchValue({
      site,
    });
  }

  onUniversityChange(university: string) {
    this.candidateForm.patchValue({
      university,
    });
  }

  submit() {
    this.onSubmit.emit();
  }

  onFacultyChange(faculty: string) {
    this.candidateForm.patchValue({
      faculty,
    });
  }

  getControlsError(controlName: string, errorName: string): boolean | null {
    return this.candidateForm.get(controlName).errors?.[errorName];
  }
}
