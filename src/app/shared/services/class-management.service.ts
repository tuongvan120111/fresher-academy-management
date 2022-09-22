import { ClassModel, LocationModel } from './../models/class.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

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

            data.general.expectedStartDate = new Date(
              data.general.expectedStartDate
            );
            data.general.expectedEndDate = new Date(
              data.general.expectedEndDate
            );

            data.detail.actualStartDate = new Date(
              data.detail.actualStartDate
            );
            data.detail.actualEndDate = new Date(
              data.detail.actualEndDate
            );
            const id = snap.payload.doc.id;
            return {
              ...data,
              id,
            };
          })
        )
      );
  }
}
