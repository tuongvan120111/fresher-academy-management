import { Injectable } from "@angular/core";
import { ADropDownService } from "./dropdown.service";
import { IResult } from "../model/result.interface";
import { IFirebaseDate } from "../model/candidate.interface";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { from, map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ResultsService extends ADropDownService<IResult<IFirebaseDate>> {
  private static readonly RESULT_COLLECTION = "candidateResults";

  constructor(private fs: AngularFirestore) {
    super(fs, ResultsService.RESULT_COLLECTION);
  }

  override loadData(): Observable<IResult<IFirebaseDate>[]> {
    return this.collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as IResult<IFirebaseDate>;
          data.id = a.payload.doc.id;
          return data;
        });
      }),
    );
  }

  loadDataById(employeeId: string) {
    from(this.collection.ref.where("employeeId", "==", employeeId).get()).pipe(
      tap(value => {
        value.forEach(doc => {
          let data = doc.data();
          console.log(data)
        })
      }),
    ).subscribe();
  }
}
