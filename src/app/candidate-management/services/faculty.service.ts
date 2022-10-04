import { Injectable } from "@angular/core";
import { ADropDownService } from "./dropdown.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map, Observable } from "rxjs";
import { ISite } from "./sites.service";

export interface IFaculty {
  name: string;
  id: string;
}

@Injectable({
  providedIn: "root",
})
export class FacultyService extends ADropDownService<IFaculty> {
  static readonly FACULTY_COLLECTION = "faculty";

  constructor(private fs: AngularFirestore) {
    super(fs, FacultyService.FACULTY_COLLECTION);
  }

  override loadData(): Observable<IFaculty[]> {
    return this.collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as ISite;
          data.id = a.payload.doc.id;
          return data;
        });
      }),
    );
  }
}
