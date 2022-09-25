import { ClassModel, LocationModel } from '../models/class-management.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { map, Observable, of } from 'rxjs';
import { ClassStatus } from '../constants/class-management.contants';
import { DatePipe } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

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
    let locations: LocationModel[] = [];
    for (let index = 0; index < 10; index++) {
      const element: LocationModel = {
        id: 'lo' + index,
        name: uuidv4(),
      };

      locations.push(element);
    }
    return of(locations);

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
    const element: ClassModel = {
      id: uuidv4(),

      general: {
        classCode: uuidv4(),
        className: uuidv4(),
        status: Math.floor(Math.random() * 3),
        plannedTraineeNo: Math.floor(Math.random() * 3),
        acceptedTraineeNo: uuidv4(),
        actualTraineeNo: uuidv4(),
        expectedStartDate: Date.now(),
        expectedEndDate: Date.now(),
        location: uuidv4(),
        locationID: 'lo' + Math.floor(Math.random() * 9),
        detailedLocation: uuidv4(),
        budgetCode: Math.floor(Math.random() * 3),
        estimatedBudget: Math.floor(Math.random() * 3),
        classAdmin: [Math.floor(Math.random() * 3)],
        learningPath: uuidv4(),
        history: uuidv4(),
      },
      detail: {
        subjectType: Math.floor(Math.random() * 3),
        subSubjectType: Math.floor(Math.random() * 3),
        deliveryType: Math.floor(Math.random() * 3),
        formatType: Math.floor(Math.random() * 3),
        scope: Math.floor(Math.random() * 3),
        supplier: uuidv4(),
        actualStartDate: Date.now(),
        actualEndDate: Date.now(),
        masterTrainer: Math.floor(Math.random() * 2),
        trainer: [],
        curriculumn: uuidv4(),
        remarks: uuidv4(),
      },

      budget: [],
      audit: [],
    };
    return of(element);
    return this.classCol.doc(id).valueChanges();
  }

  getListClass(
    startAt: number = 1,
    limit: number = 5
  ): Observable<ClassModel[]> {
    let classModel: ClassModel[] = [];
    for (let index = 0; index < 10; index++) {
      const element: ClassModel = {
        id: uuidv4(),

        general: {
          classCode: uuidv4(),
          className: uuidv4(),
          status: Math.floor(Math.random() * 100),
          plannedTraineeNo: Math.floor(Math.random() * 100),
          acceptedTraineeNo: uuidv4(),
          actualTraineeNo: uuidv4(),
          expectedStartDate: Date.now(),
          expectedEndDate: Date.now(),
          location: uuidv4(),
          locationID: uuidv4(),
          detailedLocation: uuidv4(),
          budgetCode: Math.floor(Math.random() * 100),
          estimatedBudget: Math.floor(Math.random() * 100),
          classAdmin: [],
          learningPath: uuidv4(),
          history: uuidv4(),
        },
        detail: {
          subjectType: Math.floor(Math.random() * 100),
          subSubjectType: Math.floor(Math.random() * 100),
          deliveryType: Math.floor(Math.random() * 100),
          formatType: Math.floor(Math.random() * 100),
          scope: Math.floor(Math.random() * 100),
          supplier: uuidv4(),
          actualStartDate: Date.now(),
          actualEndDate: Date.now(),
          masterTrainer: Math.floor(Math.random() * 2),
          trainer: [],
          curriculumn: uuidv4(),
          remarks: uuidv4(),
        },

        budget: [],
        audit: [],
      };

      classModel.push(element);
    }
    return of(classModel);
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

  addNewClass(data: ClassModel): Promise<DocumentReference<ClassModel>> {
    return this.classCol.add(data);
  }
}
