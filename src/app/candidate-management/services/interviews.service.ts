import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { from, map, Observable, of } from "rxjs";
import { IFirebaseDate } from "../model/candidate.interface";
import { IInterviewResult } from "../model/result.interface";
import { UtilService } from "../utils/util.service";
import { ADropDownService } from "./dropdown.service";

@Injectable({
  providedIn: "root",
})
export class InterviewsService extends ADropDownService<
  IInterviewResult<IFirebaseDate>
> {
  private static readonly INTERVIEW_COLLECTION = "interviewResults";

  constructor(private fs: AngularFirestore, private utilService: UtilService) {
    super(fs, InterviewsService.INTERVIEW_COLLECTION);
  }

  loadData(): Observable<IInterviewResult<IFirebaseDate>[]> {
    return this.collection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as IInterviewResult<IFirebaseDate>;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  loadDataById(employeeId: string) {
    return from(
      this.collection.ref.where("employeeId", "==", employeeId).get()
    ).pipe(
      map((value) => {
        let results: IInterviewResult<Date>[] = [];
        value.forEach((doc) => {
          let data = doc.data() as IInterviewResult<IFirebaseDate>;
          data.id = doc.id;
          const formatData: IInterviewResult<Date> = {
            ...data,
            time: this.utilService._formatTime(data.time),
            Date: this.utilService._formatTime(data.Date),
          };
          results.push(formatData);
        });
        return results;
      })
    );
  }

  updateResultById(
    resultId: string,
    data: Partial<IInterviewResult<IFirebaseDate>>
  ) {
    return from(this.collection.doc(resultId).update(data));
  }

  createResult(data: IInterviewResult<IFirebaseDate>) {
    return from(this.collection.add(data));
  }

  deleteResult(resultId: string) {
    return from(this.collection.doc(resultId).delete());
  }
}
