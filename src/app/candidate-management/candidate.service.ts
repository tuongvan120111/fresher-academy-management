import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import {
  ICandidate,
  IFirebaseDate,
  STATUS,
  STATUS_ARRAY,
} from "./model/candidate.interface";
import { BehaviorSubject, from, map, Observable, shareReplay, tap } from "rxjs";
import { UtilService } from "./utils/util.service";

export type FirebaseCandidateResponse = ICandidate<IFirebaseDate, STATUS>;
export type FirebaseCandidateFormat = ICandidate<Date, string>;

@Injectable()
export class CandidateService {
  private subject$ = new BehaviorSubject<FirebaseCandidateFormat[]>(null);
  candidateStore$ = this.subject$.asObservable();

  private candidates!: AngularFirestoreCollection<FirebaseCandidateResponse>;

  constructor(private db: AngularFirestore, private utilService: UtilService) {
    this.candidates = db.collection("candidates");
  }

  getCandidates(): void {
    this.candidates
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as FirebaseCandidateResponse;
            data.id = a.payload.doc.id;
            return this._formatData(data);
          });
        }),
        tap((val) => {
          this.subject$.next(val);
        }),
        shareReplay()
      )
      .subscribe();
  }

  private _formatData(
    candidate: FirebaseCandidateResponse
  ): FirebaseCandidateFormat {
    return {
      ...candidate,
      dob: this.utilService._formatTime(candidate.dob),
      status: STATUS_ARRAY[candidate.status],
      graduateYear: this.utilService._formatTime(candidate.graduateYear),
      applicationDate: this.utilService._formatTime(candidate.applicationDate),
    };
  }

  //v.payload.doc.id
  getCandidateById(id: string): Observable<FirebaseCandidateFormat> {
    return this.candidates
      .doc(id)
      .get()
      .pipe(
        map((candidate) => {
          return this._formatData(candidate.data());
        })
      );
  }

  updateCandidate(
    id: string,
    candidate: Partial<FirebaseCandidateResponse>
  ): Observable<any> {
    console.log(candidate, "<== candidate");
    return from(this.candidates.doc(id).update(candidate));
  }

  createCandidate(candidate: FirebaseCandidateResponse): Observable<any> {
    return from(this.candidates.add(candidate));
  }

  deleteCandidate(id: string): Observable<any> {
    return from(this.candidates.doc(id).delete());
  }
}
