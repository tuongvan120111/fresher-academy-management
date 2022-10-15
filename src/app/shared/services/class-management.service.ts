import { CommonService } from 'src/app/shared/services/common.service';
import {
  ClassAdminModel,
  ClassFilter,
  ClassModel,
  LocationModel,
  TrainerModel,
} from '../models/class-management.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';

import { map, Observable, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { ClassStatusString } from '../constants/class-management.contants';
import { Authentications } from '../models/common.model';
import {
  query as queryFirestore,
  collection,
  where,
  getDocs,
  QueryConstraint,
  limit as limitFirestore,
  startAt as startAtFirestore,
  orderBy as orderByFirestore,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Query,
  increment,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ClassManagementService {
  private locationCol!: AngularFirestoreCollection<any>;
  private classAdminCol!: AngularFirestoreCollection<any>;
  private trainerCol!: AngularFirestoreCollection<any>;
  private classCol!: AngularFirestoreCollection<ClassModel>;
  private userInfo: Authentications | undefined;
  private datePipe = new DatePipe('en-US');

  constructor(private db: AngularFirestore, private commonSer: CommonService) {
    this.locationCol = db.collection('locations');
    this.classAdminCol = db.collection('classAdmin');
    this.trainerCol = db.collection('trainer');
    this.classAdminCol = db.collection('classAdmin');
    this.classCol = db.collection('classManagement');
    this.userInfo = this.commonSer.getCurrentUser();
  }

  getListMasterTrainers(): Observable<TrainerModel[]> {
    return this.trainerCol.snapshotChanges().pipe(
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

  getListClassAdmins(): Observable<ClassAdminModel[]> {
    return this.classAdminCol.snapshotChanges().pipe(
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

  getLocationByID(id: string = ''): Observable<LocationModel> {
    return this.locationCol.doc(id).valueChanges();
  }

  getClassByID(id: string = ''): Observable<any> {
    return this.classCol.doc(id).valueChanges();
  }

  async getListClass(
    startAt: number = 0,
    limit: number = 5,
    filter?: ClassFilter
  ) {
    const classManagementRef = collection(this.db.firestore, 'classManagement');
    let queryData: QueryConstraint[] = [
      limitFirestore(limit),
      // orderByFirestore('createdDate'),
    ];

    const {
      location = 'All',
      name = '',
      status = 'All',
      fromDate = 0,
      toDate,
    } = filter || {};

    if (location !== 'All') {
      queryData.push(where('general.location', '==', location));
    }
    if (!!name) {
      queryData.push(where('general.className', '==', name));
    }
    if (status !== 'All') {
      queryData.push(where('general.status', '==', status));
    }
    if (!!fromDate) {
      queryData.push(
        where(
          'detail.actualStartDate',
          '>=',
          this.convertDateToTimestamp(fromDate)
        )
      );
    }
    if (!!toDate) {
      queryData.push(
        where('detail.actualEndDate', '<=', this.convertDateToTimestamp(toDate))
      );
    }
    const query: Query<any> = queryFirestore(classManagementRef, ...queryData);
    const querySnapshot: QuerySnapshot<ClassModel> = await getDocs(query);
    const docs: QueryDocumentSnapshot<ClassModel>[] = querySnapshot.docs;
    const results: ClassModel[] = docs.map(
      (doc: QueryDocumentSnapshot<ClassModel>) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      }
    );

    return results;
    // return this.db
    //   .collection('classManagement', (ref) => {
    //     const statusFilter = status !== 'All' ? '==' : '!=';
    //     const locationFilter = status !== 'All' ? '==' : '!=';
    //     const nameFilter = !!name ? '==' : '!=';
    //     return (
    //       ref
    //         // .where('general.status', statusFilter, status)
    //         // .where('general.location', locationFilter, location)
    //         // .where('general.name', nameFilter, name)
    //         // .where('detail.actualStartDate', '<=', fromDate || 0)
    //         // .where('detail.actualEndDate', '>=', toDate || 0)
    //         .orderBy('general.expectedStartDate')
    //         .startAt(startAt)
    //         .limit(limit)
    //     );
    //   })
    //   .snapshotChanges()
    //   .pipe(
    //     map((snaps) =>
    //       snaps.map((snap) => {
    //         let data = snap.payload.doc.data() as ClassModel;
    //         const id = snap.payload.doc.id;
    //         return {
    //           ...data,
    //           id,
    //         };
    //       })
    //     )
    //   );
  }

  updateStatusClass(
    id: string,
    data: ClassModel,
    status: string,
    remarksContent: string = ''
  ) {
    let history = data.general.history;
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    history += `${currentDate} - "${status} by" ${this.userInfo?.userName}${
      status === ClassStatusString.Rejected ? ' - ' + remarksContent : ''
    }\n`;

    data = this.convertDateToTimestampAllValue(data);

    this.classCol.doc(id).update({
      ...data,
      general: {
        ...data.general,
        status: status,
        history: history,
      },
    });
  }

  addNewClass(data: ClassModel): Promise<DocumentReference<ClassModel>> {
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

    data.general.status = ClassStatusString.Draft;
    data.createdDate = Date.now();

    data = this.convertDateToTimestampAllValue(data);

    let history = data.general.history;
    history += `${currentDate} - '${status} by ${this.userInfo?.userName}', `;
    data.general.history = history;
    return this.classCol.add(data);
  }

  generateClassCode(acronym: string = 'Site', file: File) {
    return `${acronym}`;
  }

  convertDateToTimestamp(date: Date | number): number {
    return new Date(date).getTime();
  }

  convertDateToTimestampAllValue(data: ClassModel): ClassModel {
    data.general.expectedStartDate = this.convertDateToTimestamp(
      data.general.expectedStartDate
    );
    data.general.expectedEndDate = this.convertDateToTimestamp(
      data.general.expectedEndDate
    );

    data.detail.actualEndDate = this.convertDateToTimestamp(
      data.detail.actualEndDate
    );
    data.detail.actualStartDate = this.convertDateToTimestamp(
      data.detail.actualStartDate
    );

    return data;
  }
}
