import { Injectable } from "@angular/core";
import { ADropDownService } from "./dropdown.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map, Observable } from "rxjs";
import { ISite } from "./sites.service";

export interface IChannel {
  name: string;
  id: string;
}

@Injectable({
  providedIn: "root",
})
export class ChannelService extends ADropDownService<IChannel> {
  static readonly CHANNEL_COLLECTIONS = "channel";

  constructor(private fs: AngularFirestore) {
    super(fs, ChannelService.CHANNEL_COLLECTIONS);
  }

  override loadData(): Observable<IChannel[]> {
    return this.collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as ISite;
          data.id = a.payload.doc.id;
          return data;
        });
      }),
    )
  }
}
