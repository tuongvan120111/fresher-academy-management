import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { GENDER, ICandidate, IFirebaseDate, STATUS } from "./model/candidate.interface";
import { map, Observable, shareReplay, Subject, tap } from "rxjs";

@Injectable()
export class CandidateService {
  private subject$ = new Subject<ICandidate<Date, string>[]>();
  candidateStore$ = this.subject$.asObservable();

  private candidates!: AngularFirestoreCollection<ICandidate<IFirebaseDate, STATUS>>;

  constructor(private db: AngularFirestore) {
    this.candidates = db.collection('candidates');
    this.getCandidates();
  }

  getCandidates(): void {
    this.candidates.valueChanges().pipe(
      map((candidates) => {
        console.log(candidates)
        return candidates.map((candidate) => {
          const formatTime = new Date(
            (candidate.dob as IFirebaseDate).seconds * 1000 + (candidate.dob as IFirebaseDate).nanoseconds / 1000000,
          );
          return {
            ...candidate,
            dob: formatTime,
            status: candidate.status === STATUS.PASS ? 'pass' : 'failed'
          }
        })
      }),
      tap((val) => this.subject$.next(val)),
      shareReplay(),
    ).subscribe()
  }

}
