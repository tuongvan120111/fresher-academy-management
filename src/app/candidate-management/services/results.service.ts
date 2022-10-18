import { Injectable } from "@angular/core";
import { ADropDownService } from "./dropdown.service";
import { IResult } from "../model/result.interface";
import { IFirebaseDate } from "../model/candidate.interface";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { from, map, Observable, tap } from "rxjs";
import { UtilService } from "../utils/util.service";

@Injectable({
  providedIn: "root",
})
export class ResultsService extends ADropDownService<IResult<IFirebaseDate>> {
  private static readonly RESULT_COLLECTION = "candidateResults";

  constructor(private fs: AngularFirestore, private utilService: UtilService) {
    super(fs, ResultsService.RESULT_COLLECTION);
  }

  override loadData(): Observable<IResult<IFirebaseDate>[]> {
    return this.collection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as IResult<IFirebaseDate>;
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
        let results: IResult<Date>[] = [];
        value.forEach((doc) => {
          let data = doc.data() as IResult<IFirebaseDate>;
          data.id = doc.id;
          const formatData: IResult<Date> = {
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

  updateResultById(resultId: string, data: Partial<IResult<IFirebaseDate>>) {
    return from(this.collection.doc(resultId).update(data));
  }

  createResult(data: IResult<IFirebaseDate>) {
    return from(this.collection.add(data));
  }

  deleteResult(resultId: string) {
    return from(this.collection.doc(resultId).delete())
  }
}
