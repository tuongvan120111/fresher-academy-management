import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CANDIDATE_TAB_TYPE } from "../utils/candidate.const";
import { CandidateService, FirebaseCandidateFormat } from "../candidate.service";
import { map, Observable, of, switchMap, tap } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IUniversity, UniversityService } from "../services/university.service";
import { ISite, SitesService } from "../services/sites.service";
import { ChannelService, IChannel } from "../services/channel.service";
import { FacultyService, IFaculty } from "../services/faculty.service";
import firebase from "firebase/compat/app";
import * as moment from "moment";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import firestore = firebase.firestore;

const OTHER_OPTION: IUniversity = {
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
    private dialog: MatDialog,
  ) {
  }

  private _initData() {
    this.candidate$ = this.candidatesService.getCandidateById(this.candidateId).pipe(tap(console.log));
    this.university$ = this.universityService.loadUniversity().pipe(
      map(universities => {
        universities.push(OTHER_OPTION);
        return universities;
      }),
    );
    this.sites$ = this.sitesService.loadSites();
    this.channels$ = this.channelService.loadData();
    this.faculty$ = this.facultyService.loadData().pipe(
      map(faculties => {
        faculties.push(OTHER_OPTION);
        return faculties;
      }),
    );
  }

  ngOnInit(): void {
    this.type = this.route.snapshot.params["type"];
    this.candidateId = this.route.snapshot.queryParams["id"];
    this._initData();

    this.candidateFormGroup = new FormGroup<any>({
      name: new FormControl(""),
      account: new FormControl(""),
      dob: new FormControl(new Date()),
      gender: new FormControl(""),
      university: new FormControl(""),
      faculty: new FormControl(""),
      phone: new FormControl("", [Validators.minLength(10), Validators.maxLength(14)]),
      email: new FormControl("", [Validators.email]),
      skill: new FormControl(""),
      language: new FormControl(""),
      note: new FormControl(""),
      level: new FormControl(""),
      graduateYear: new FormControl(new Date()),
      applicationDate: new FormControl(new Date()),
      site: new FormControl(""),
      channel: new FormControl(""),
    });
  }

  get isCreate(): boolean {
    return this.type === CANDIDATE_TAB_TYPE.CREATE;
  }

  private _formatFirebaseDate(date: string | Date) {
    let momentDate;
    if (typeof date === "string") {
      momentDate = moment(date).toDate();
    } else {
      momentDate = date;
    }
    return firestore.Timestamp.fromDate(momentDate);
  }

  submit() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
    });
    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result.ok) {
          if (this.candidateFormGroup.valid) {
            const {
              skill,
              note,
              name,
              site,
              dob,
              university,
              applicationDate,
              phone,
              language,
              channel,
              account,
              gender,
              faculty,
              email,
              graduateYear,
              level,
            } = this.candidateFormGroup.value;
            return this.candidatesService.updateCandidate(this.candidateId, {
              skill: skill,
              applicationDate: this._formatFirebaseDate(applicationDate),
              note: note,
              name: name,
              site: site,
              dob: this._formatFirebaseDate(dob),
              university,
              phone,
              language,
              history: `HoangPT11 ${moment(new Date()).format("DD-MMM-YYYY")}`,
              channel,
              account,
              gender,
              faculty,
              email,
              graduateYear: this._formatFirebaseDate(graduateYear),
              level,
            });
          } else {
            return of(null);
          }
        } else {
          return of(null);
        }
      }),
    ).subscribe();
  }
}
