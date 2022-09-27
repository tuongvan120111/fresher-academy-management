import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { ICandidate, IFirebaseDate, STATUS } from "./model/candidate.interface";
import { concatMap, map, Observable, of, shareReplay, Subject, tap } from "rxjs";

export type FirebaseCandidateResponse = ICandidate<IFirebaseDate, STATUS>;
export type FirebaseCandidateFormat = ICandidate<Date, string>;

@Injectable()
export class CandidateService {
  private subject$ = new Subject<FirebaseCandidateFormat[]>();
  candidateStore$ = this.subject$.asObservable();

  private candidates!: AngularFirestoreCollection<FirebaseCandidateResponse>;

  constructor(private db: AngularFirestore) {
    this.candidates = db.collection("candidates");
  }

  getCandidates(): void {
    this.candidates
      .valueChanges()
      .pipe(
        map((candidates) => {
          return candidates.map((candidate) => {
            return CandidateService._formatData(candidate);
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
    const formatTime = new Date(
      (candidate.dob as IFirebaseDate).seconds * 1000 +
      (candidate.dob as IFirebaseDate).nanoseconds / 1000000,
    );
    return {
      ...candidate,
      dob: formatTime,
      status: candidate.status === STATUS.PASS ? "pass" : "failed",
    };
  }

  //v.payload.doc.id
  getCandidateById(id: string): any {
    return this.candidates.snapshotChanges().pipe(
      map((actions) => {
        let candidates = actions.map((a) => {
          const data = a.payload.doc.data() as FirebaseCandidateResponse;
          data.id = a.payload.doc.id;
          return data;
        });
        return candidates
      }),
      tap(
        val => {
          this.subject$.next(val.map((candidate) => CandidateService._formatData(candidate)));
        }
      )
      // map((candidates) => {
      //   return candidates.find(c => c.employeeId === id);
      // }),
      // tap(console.log)
    )
  }
}
