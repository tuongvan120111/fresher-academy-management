import { ClassModel, LocationModel } from '../models/class-management.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { ClassStatus } from '../constants/class-management.contants';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ClassManagementService {
  private locationCol!: AngularFirestoreCollection<any>;
  private classCol!: AngularFirestoreCollection<ClassModel>;

  constructor(private db: AngularFirestore) {
    this.locationCol = db.collection('locations');
    this.classCol = db.collection('classManagement');
  }

  getListLocations(): Observable<LocationModel[]> {
    return this.locationCol.snapshotChanges().pipe(
      map((snaps) =>
        snaps.map((snap) => {
          return {
            id: snap.payload.doc.id,
            ...(snap.payload.doc.data() as {}),
          };
        })
      )
    );
  }

  getLocationByID(id: string = ''): Observable<string> {
    return this.locationCol.doc(id).valueChanges();
  }

  getListClass(
    startAt: number = 1,
    limit: number = 5
  ): Observable<ClassModel[]> {
    return this.db
      .collection(
        'classManagement',
        (ref) => ref
        // ref.limit(limit)
      )
      .snapshotChanges()
      .pipe(
        map((snaps) =>
          snaps.map((snap) => {
            let data = snap.payload.doc.data() as ClassModel;
            const id = snap.payload.doc.id;
            return {
              ...data,
              id,
            };
          })
        )
      );
  }

  cancleClass(data: ClassModel) {
    const datePipe = new DatePipe('en-US');
    let history = data.general.history;
    const currentDate = datePipe.transform(new Date(), 'dd/MM/yyyy');
    history = currentDate + ' - "Cancelled by" username';

    this.classCol.doc(data.id).update({
      general: {
        ...data.general,
        status: 8,
        history: history,
      },
    });
    console.log('cancleClass done');
  }
}
