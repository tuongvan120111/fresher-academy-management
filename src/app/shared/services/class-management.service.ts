import { ClassAudit } from './../models/class-management.model';
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

import { map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ClassStatusString } from '../constants/class-management.contants';
import { Authentications } from '../models/common.model';
import {
  query as queryFirestore,
  collection,
  where,
  getDocs,
  QueryConstraint,
  limit as limitFirestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Query,
} from 'firebase/firestore';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import { SendMailService } from './send-mail.service';

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

  constructor(
    private db: AngularFirestore,
    private commonSer: CommonService,
    private sendMailService: SendMailService
  ) {
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
      // limitFirestore(limit),
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
      queryData.push(
        where('general.className', '==', `Fresher Developer ${name}`)
      );
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
    } else if (!!toDate) {
      queryData.push(
        where('detail.actualEndDate', '<=', this.convertDateToTimestamp(toDate))
      );
    }
    const query: Query<any> = queryFirestore(classManagementRef, ...queryData);
    const querySnapshot: QuerySnapshot<ClassModel> = await getDocs(query);
    const docs: QueryDocumentSnapshot<ClassModel>[] = querySnapshot.docs;
    const results: ClassModel[] = docs
      .filter((doc: QueryDocumentSnapshot<ClassModel>) =>
        !!toDate
          ? doc.data().detail.actualEndDate <=
            this.convertDateToTimestamp(toDate)
          : true
      )
      .map((doc: QueryDocumentSnapshot<ClassModel>) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });

    return results;
  }

  updateStatusClass(
    id: string,
    data: ClassModel,
    status: string,
    remarksContent: string = ''
  ) {
    let history = data.general.history;
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

    history +=
      (!!history ? '\n' : '') +
      `${currentDate} - "${status} by" ${this.userInfo?.userName}${
        status === ClassStatusString.Rejected ? ' - ' + remarksContent : ''
      }`;

    data = this.convertDateToTimestampAllValue(data);

    const { classCode, className, classAdmin } = data.general;
    const { masterTrainer, trainer } = data.detail;

    const listTrainer: string[] = [...trainer, masterTrainer];

    console.log(status);
    this.sendMailWhenUpdateClass(
      id,
      status,
      classCode,
      className,
      classAdmin,
      listTrainer
    );

    if (status === ClassStatusString.Updated && !!listTrainer) {
      this.sendMailWhenUpdateClass(
        id,
        ClassStatusString.Assigned,
        classCode,
        className,
        classAdmin,
        listTrainer
      );
    }

    return this.classCol.doc(id).update({
      ...data,
      general: {
        ...data.general,
        status: status,
        history: history,
      },
      // detail: {
      //   ...data.detail,
      //   remarks: remarksContent,
      // },
    });
  }

  addNewClass(
    data: ClassModel
  ): Promise<DocumentReference<ClassModel>> | undefined {
    const { classCode, className, classAdmin } = data.general;
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

    data.general.status = ClassStatusString.Draft;
    data.createdDate = Date.now();

    data = this.convertDateToTimestampAllValue(data);

    let history = data.general.history;
    history += `${currentDate} - '${status} by ${this.userInfo?.userName}', `;
    data.general.history = history;
    let result: Promise<DocumentReference<ClassModel>> | undefined;
    try {
      result = this.classCol.add(data);
      this.sendMailService
        .sendMail(
          classAdmin,
          [],
          `[FA MANAGEMENT]: The Class ${classCode} is assigned to you.`,
          {
            theClass: `${classCode} - ${className}`,
            className: '',
            link: `http://localhost:4200/class-management/${data.id}`,
            status: 'assigned for you',
          }
        )
        .subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (error) => {
            console.log('error: ', error);
          },
        });
    } catch (error) {
      throw error;
    }
    return result;
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

    let auditData: ClassAudit[] = [];
    data.audit.map((audit) => {
      audit.deadline = this.convertDateToTimestamp(audit.deadline);
      audit.date = this.convertDateToTimestamp(audit.date);
      auditData.push(audit);
    });

    data.audit = auditData;

    return data;
  }

  sendMailWhenUpdateClass(
    id: string,
    status: string,
    classCode: string,
    className: string,
    to: string[],
    trainer: string[] = []
  ) {
    let body = {
      theClass: `${classCode} - ${className}`,
      className: '',
      link: `http://localhost:4200/class-management/${id}`,
      status: 'has been updated',
    };
    let subject = '';
    let cc: string[] = [];

    switch (status) {
      case ClassStatusString.Updated:
        body.status = 'has been updated';
        subject = `[FA MANAGEMENT]: The Class ${classCode} is updated.`;
        break;
      case ClassStatusString.Assigned:
        cc = trainer;
        body.status = 'has been assigned for you';
        subject = `[FA MANAGEMENT]: The Class ${classCode} is assigned to you.`;
        break;
      case ClassStatusString.Canceled:
        body.status = 'has been cancelled by Delivery Manager';
        subject = `[FA MANAGEMENT]: The Class ${classCode} has been cancelled.`;
        break;
      case (ClassStatusString.Pending, ClassStatusString.Submitted):
        body.status = 'has been pending for your approval';
        subject = `[FA MANAGEMENT]: The Class ${classCode} needs your approval.`;
        break;
      case ClassStatusString.Approved:
        body.status = 'has been pending for your acceptance';
        subject = `[FA MANAGEMENT]: The Class ${classCode} needs your acceptance.`;
        break;
      case ClassStatusString.Rejected:
        cc = trainer;
        body.status = 'has been rejected by Delivery Manager';
        subject = `[FA MANAGEMENT]: The Class ${classCode} has been rejected.`;
        break;
      case ClassStatusString.Accepted:
        body.status = 'has been accepted by FA Manager';
        subject = `[FA MANAGEMENT]: The Class ${classCode} has been accepted.`;
        break;
      case ClassStatusString.Declined:
        body.status = 'has been declined by FA Manager';
        subject = `[FA MANAGEMENT]: The Class ${classCode} has been declined.`;
        break;
      case ClassStatusString.Started:
        cc = trainer;
        body.status = 'has been started by Class Admin';
        subject = `[FA MANAGEMENT]: The Class ${classCode} has been started.`;
        break;
      case ClassStatusString.Finished:
        cc = trainer;
        body.className = classCode;
        body.status = 'has been finished by Class Admin';
        subject = `[FA MANAGEMENT]: The Class ${classCode} has been finished.`;
        break;
      case ClassStatusString.Closed:
        body.className = classCode;
        body.status = 'has been closed by Delivery Manager';
        subject = `[FA MANAGEMENT]: The Class ${classCode} has been closed.`;
        break;
      case ClassStatusString.Requested:
        body.status = 'has been requested for more information';
        subject = `[FA MANAGEMENT]: The Class ${classCode} has been requested for more information by Delivery Manager.`;
        break;

      default:
        break;
    }

    this.sendMailService.sendMail(to, cc, subject, body).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log('error: ', error);
      },
    });
  }
}
