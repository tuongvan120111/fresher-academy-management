import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { map } from "rxjs";

export interface IUniversity {
  id: string;
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class UniversityService {
  private university!: AngularFirestoreCollection<IUniversity>;

  constructor(private db: AngularFirestore) {
    this.university = db.collection("university");
  }

  loadUniversity() {
    return this.university.snapshotChanges().pipe(
      map(actions => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as IUniversity;
          data.id = a.payload.doc.id;
          return data;
        });
      }),
    );
  }
}
