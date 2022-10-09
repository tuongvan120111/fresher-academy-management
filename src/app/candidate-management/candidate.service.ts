import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { ICandidate, IFirebaseDate, STATUS } from "./model/candidate.interface";
import { BehaviorSubject, from, map, Observable, shareReplay, tap } from "rxjs";

export type FirebaseCandidateResponse = ICandidate<IFirebaseDate, STATUS>;
export type FirebaseCandidateFormat = ICandidate<Date, string>;

@Injectable()
export class CandidateService {
  private subject$ = new BehaviorSubject<FirebaseCandidateFormat[]>(null);
  candidateStore$ = this.subject$.asObservable();

  private candidates!: AngularFirestoreCollection<FirebaseCandidateResponse>;

  constructor(private db: AngularFirestore) {
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
            return CandidateService._formatData(data);
          });
        }),
        tap((val) => {
          this.subject$.next(val);
        }),
        shareReplay(),
      )
      .subscribe();
  }

  private static _formatData(candidate: FirebaseCandidateResponse): FirebaseCandidateFormat {
    return {
      ...candidate,
      dob: CandidateService._formatTime(candidate.dob),
      status: candidate.status === STATUS.PASS ? "pass" : "failed",
      graduateYear: CandidateService._formatTime(candidate.graduateYear),
      applicationDate: CandidateService._formatTime(candidate.applicationDate),
    };
  }

  private static _formatTime(value: IFirebaseDate): Date {
    return new Date(
      value.seconds * 1000 +
      value.nanoseconds / 1000000,
    );
  }

  //v.payload.doc.id
  getCandidateById(id: string): Observable<FirebaseCandidateFormat> {
    return this.candidates.doc(id).get().pipe(
      map(candidate => {
        return CandidateService._formatData(candidate.data());
      }),
    );
  }

  updateCandidate(id: string, candidate: Partial<FirebaseCandidateResponse>): Observable<any> {
    return from(this.candidates.doc(id).update(candidate));
  }
}
