import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { ICandidate, IFirebaseDate, STATUS } from "./model/candidate.interface";
import { map, Observable, of, shareReplay, Subject, tap } from "rxjs";

@Injectable()
export class CandidateService {
  private subject$ = new Subject<ICandidate<Date, string>[]>();
  candidateStore$ = this.subject$.asObservable();

  private candidates!: AngularFirestoreCollection<
    ICandidate<IFirebaseDate, STATUS>
  >;

  constructor(private db: AngularFirestore) {
    this.candidates = db.collection("candidates");
    this.getCandidateById('')
  }

  getCandidates(): void {
    this.candidates
      .valueChanges()
      .pipe(
        map((candidates) => {
          console.log(candidates);
          return candidates.map((candidate) => {
            return this._formatData(candidate);
          });
        }),
        tap((val) => {
          console.log(val, "<== val");
          this.subject$.next(val);
        }),
        shareReplay()
      )
      .subscribe();
  }

  private _formatData(candidate: ICandidate<IFirebaseDate, STATUS>) {
    const formatTime = new Date(
      (candidate.dob as IFirebaseDate).seconds * 1000 +
        (candidate.dob as IFirebaseDate).nanoseconds / 1000000
    );
    return {
      ...candidate,
      dob: formatTime,
      status: candidate.status === STATUS.PASS ? "pass" : "failed",
    };
  }

  getCandidateById(id: string): Observable<ICandidate<Date, string>> {
    this.candidates.snapshotChanges().subscribe(val => {
      val.map(v => {
        console.log(v.payload.doc.id)
      })
    })
    return of();
  }
}
