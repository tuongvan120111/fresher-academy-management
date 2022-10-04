import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CANDIDATE_TAB_TYPE } from "../utils/candidate.const";
import { CandidateService, FirebaseCandidateFormat } from "../candidate.service";
import { map, Observable, tap } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { IUniversity, UniversityService } from "../services/university.service";
import { ISite, SitesService } from "../services/sites.service";
import { ChannelService, IChannel } from "../services/channel.service";
import { FacultyService, IFaculty } from "../services/faculty.service";

const OTHER_UNIVERSITY_OPTION: IUniversity = {
  name: "Other",
  id: "411060",
};

@Component({
  selector: "app-update-candidate",
  templateUrl: "./update-candidate.component.html",
  styleUrls: ["./update-candidate.component.scss"],
})
export class UpdateCandidateComponent implements OnInit {
  university$: Observable<IUniversity[]>;
  candidate$: Observable<FirebaseCandidateFormat>;
  sites$: Observable<ISite[]>;
  channels$: Observable<IChannel[]>;
  faculty$: Observable<IFaculty[]>;

  type = CANDIDATE_TAB_TYPE.CREATE;
  candidateId: string = "";
  candidateFormGroup: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private candidatesService: CandidateService,
    private universityService: UniversityService,
    private sitesService: SitesService,
    private channelService: ChannelService,
    private facultyService: FacultyService,
  ) {
  }

  private _initData() {
    this.candidate$ = this.candidatesService.getCandidateById(this.candidateId).pipe(tap(console.log));
    this.university$ = this.universityService.loadUniversity().pipe(
      map(universities => {
        universities.push(OTHER_UNIVERSITY_OPTION);
        return universities;
      }),
    );
    this.sites$ = this.sitesService.loadSites();
    this.channels$ = this.channelService.loadData();
    this.faculty$ = this.facultyService.loadData();
  }

  ngOnInit(): void {
    this.type = this.route.snapshot.params["type"];
    this.candidateId = this.route.snapshot.queryParams["id"];
    this._initData();

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
      applicationDate: new FormControl(new Date()),
    });
  }

  get isCreate(): boolean {
    return this.type === CANDIDATE_TAB_TYPE.CREATE;
  }

}
