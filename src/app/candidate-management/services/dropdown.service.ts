import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";

export abstract class ADropDownService<T> {
  collection: AngularFirestoreCollection<T>;

  protected constructor(private db: AngularFirestore, collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  abstract loadData(): Observable<T[]>
}
