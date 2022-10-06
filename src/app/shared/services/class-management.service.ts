import { CommonService } from 'src/app/shared/services/common.service';
import { ClassModel, LocationModel } from '../models/class-management.model';
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

@Injectable({
  providedIn: 'root',
})
export class ClassManagementService {
  private locationCol!: AngularFirestoreCollection<any>;
  private classCol!: AngularFirestoreCollection<ClassModel>;
  private userInfo: Authentications | undefined;
  private datePipe = new DatePipe('en-US');

  constructor(private db: AngularFirestore, private commonSer: CommonService) {
    this.locationCol = db.collection('locations');
    this.classCol = db.collection('classManagement');
    this.userInfo = this.commonSer.getCurrentUser();
  }

  getListLocations(): Observable<LocationModel[]> {
    // let locations: LocationModel[] = [];
    // for (let index = 0; index < 10; index++) {
    //   const element: LocationModel = {
    //     id: 'lo 3er ' + index,
    //     name: 'ooqweqwoeoe' + index,
    //   };

    //   locations.push(element);
    // }
    // return of(locations);

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

  getClassByID(id: string = ''): Observable<any> {
    // const element: ClassModel = {
    //   id: uuidv4(),

    //   general: {
    //     classCode: uuidv4(),
    //     className: uuidv4(),
    //     status: ClassStatusString.Submitted,
    //     plannedTraineeNo: Math.floor(Math.random() * 3),
    //     acceptedTraineeNo: uuidv4(),
    //     actualTraineeNo: uuidv4(),
    //     expectedStartDate: Date.now(),
    //     expectedEndDate: Date.now(),
    //     location: uuidv4(),
    //     locationID: 'lo 3er ' + Math.floor(Math.random() * 9),
    //     detailedLocation: uuidv4(),
    //     budgetCode: 'CTC_Specific_Fresher_Allowance',
    //     estimatedBudget: Math.floor(Math.random() * 3),
    //     classAdmin: [Math.floor(Math.random() * 3)],
    //     learningPath: uuidv4(),
    //     history: uuidv4(),
    //   },
    //   detail: {
    //     subjectType: Math.floor(Math.random() * 3),
    //     subSubjectType: Math.floor(Math.random() * 3),
    //     deliveryType: Math.floor(Math.random() * 3),
    //     formatType: Math.floor(Math.random() * 3),
    //     scope: Math.floor(Math.random() * 3),
    //     supplier: uuidv4(),
    //     actualStartDate: Date.now(),
    //     actualEndDate: Date.now(),
    //     masterTrainer: Math.floor(Math.random() * 2),
    //     trainer: [],
    //     curriculumn: uuidv4(),
    //     remarks: uuidv4(),
    //   },

    //   budget: [
    //     {
    //       total: Math.floor(Math.random() * 2),
    //       // overBudget: Math.floor(Math.random() * 2),

    //       item: uuidv4(),
    //       unit: uuidv4(),
    //       unitExpense: Math.floor(Math.random() * 2),

    //       quantity: Math.floor(Math.random() * 2),
    //       amount: Math.floor(Math.random() * 2),
    //       tax: Math.floor(Math.random() * 2),

    //       // sum: number;
    //       note: uuidv4(),
    //     },
    //     {
    //       total: Math.floor(Math.random() * 2),
    //       // overBudget: Math.floor(Math.random() * 2),

    //       item: uuidv4(),
    //       unit: uuidv4(),
    //       unitExpense: Math.floor(Math.random() * 2),

    //       quantity: Math.floor(Math.random() * 2),
    //       amount: Math.floor(Math.random() * 2000000),
    //       tax: Math.floor(Math.random() * 2),

    //       // sum: number;
    //       note: uuidv4(),
    //     },
    //     {
    //       total: Math.floor(Math.random() * 2),
    //       // overBudget: Math.floor(Math.random() * 2),

    //       item: uuidv4(),
    //       unit: uuidv4(),
    //       unitExpense: Math.floor(Math.random() * 2),

    //       quantity: Math.floor(Math.random() * 2),
    //       amount: Math.floor(Math.random() * 2),
    //       tax: Math.floor(Math.random() * 2),

    //       // sum: number;
    //       note: uuidv4(),
    //     },
    //   ],
    //   audit: [],

    //   createdDate: new Date(),
    //   updatedDate: new Date(),
    // };
    // return of(element);
    return this.classCol.doc(id).valueChanges();
  }

  getListClass(
    startAt: number = 0,
    limit: number = 5,
    filter: any = {}
  ): Observable<ClassModel[]> {
    console.log(filter);
    const {
      location = 'All',
      name = '',
      status = 'All',
      fromDate = 0,
      toDate = 0,
    } = filter;
    return this.db
      .collection('classManagement', (ref) => {
        if (location !== 'All') {
          console.log(1);
          ref.where('general.locationID', '==', location);
        }
        if (!!name) {
          console.log(2);
          ref.where('general.className', '==', name);
        }
        if (status !== 'All') {
          console.log(3);
          ref.where('general.status', '==', status);
        }
        if (!!fromDate) {
          console.log(4);
          ref.where('detail.actualStartDate', '<=', fromDate);
        }
        if (!!toDate) {
          console.log(5);
          ref.where('detail.actualEndDate', '>=', toDate);
        }

        const statusFilter = status !== 'All' ? '==' : '!=';
        const locationFilter = status !== 'All' ? '==' : '!=';
        const nameFilter = !!name ? '==' : '!=';
        return ref
          // .where('general.status', statusFilter, status)
          // .where('general.location', locationFilter, location)
          // .where('general.name', nameFilter, name)
          // .where('detail.actualStartDate', '<=', fromDate || 0)
          // .where('detail.actualEndDate', '>=', toDate || 0)
          .orderBy('general.expectedStartDate')
          .startAt(startAt)
          .limit(limit);
      })
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

  updateStatusClass(
    data: ClassModel,
    status: string,
    remarksContent: string = ''
  ) {
    let history = data.general.history;
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    history += `${currentDate} - '${status} by ${this.userInfo?.userName}' ${
      status === ClassStatusString.Rejected ? '- ' + remarksContent : ''
    }, `;

    // console.log({
    //   ...data,
    //   general: {
    //     ...data.general,
    //     status: status,
    //     history: history,
    //   },
    // });
    // return;
    this.classCol.doc(data.id).update({
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
    let history = data.general.history;
    history += `${currentDate} - '${status} by ${this.userInfo?.userName}', `;
    data.general.history = history;
    return this.classCol.add(data);
  }

  generateClassCode(acronym: string = 'Site', file: File) {
    return `${acronym}`;
  }
}
