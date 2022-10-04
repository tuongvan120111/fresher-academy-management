import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { map } from "rxjs";

export interface ISite {
  name: string;
  id: string;
}

@Injectable({
  providedIn: "root",
})
export class SitesService {
  private sites!: AngularFirestoreCollection<ISite>;

  constructor(private db: AngularFirestore) {
    this.sites = db.collection("sites");
  }

  loadSites() {
    return this.sites.snapshotChanges().pipe(
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
