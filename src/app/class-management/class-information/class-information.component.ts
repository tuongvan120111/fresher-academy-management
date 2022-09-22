import { LocationModel, ClassModel } from './../../shared/models/class.model';
import { ClassManagementService } from './../../shared/services/class-management.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MatTable } from '@angular/material/table';
import {
  BudgetCodeList,
  DeliveryTypeList,
  FormatTypeList,
  ScopeList,
  SubjectTypeList,
  SubSubjectTypeList,
} from 'src/app/shared/constants/class.contants';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-class-information',
  templateUrl: './class-information.component.html',
  styleUrls: ['./class-information.component.scss'],
})
export class ClassInformationComponent implements OnInit {
  budgetDisplayedColumns: string[] = [
    'add',
    'item',
    'unit',
    'unitExpense',
    'quality',
    'amount',
    'tax',
    'sum',
    'note',
  ];
  auditDisplayedColumns: string[] = [
    'add',
    'date',
    'eventCategory',
    'relatedPeople',
    'action',
    'pic',
    'deadline',
    'note',
  ];

  budgetData: Array<any> = [];
  auditData: Array<any> = [];

  @Input() isUpdateClass: boolean = false;
  @Input() classManagementData!: ClassModel;
  @Output() toggleIsCreateClass = new EventEmitter();

  @ViewChild('budgetTable')
  budgetTable!: MatTable<any>;

  @ViewChild('auditTable')
  auditTable!: MatTable<any>;

  budgetCodeList: Array<any> = BudgetCodeList;
  subjectTypeList: Array<any> = SubjectTypeList;
  subSubjectTypeList: Array<any> = SubSubjectTypeList;
  deliveryTypeList: Array<any> = DeliveryTypeList;
  formatTypeList: Array<any> = FormatTypeList;
  scopeList: Array<any> = ScopeList;

  addClassFrom!: FormGroup;
  locationList: Observable<LocationModel[]>;
  classAdmin = new FormControl('');
  classAdminList: Array<any> = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private classManagementService: ClassManagementService
  ) {
    this.addClassFrom = formBuilder.group({
      general: formBuilder.group({
        classCode: [''],
        className: [''],
        status: [''],
        plannedTraineeNo: [''],
        acceptedTraineeNo: [''],
        actualTraineeNo: [''],
        expectedStartDate: [new Date(), Validators.required],
        expectedEndDate: [new Date(), Validators.required],
        locationID: ['', Validators.required],
        detailedLocation: [''],
        budgetCode: ['', Validators.required],
        estimatedBudget: [0, Validators.required],
        classAdmin: [[], Validators.required],
        learningPath: ['', Validators.required],
        history: [''],
      }),

      detail: formBuilder.group({
        subjectType: [''],
        subSubjectType: [''],
        deliveryType: [''],
        formatType: [0],
        scope: [''],
        supplier: [''],
        actualStartDate: [new Date()],
        actualEndDate: [new Date()],
        masterTrainer: [''],
        trainer: [[]],
        curriculumn: [''],
        remarks: [0],
      }),
    });
    this.locationList = this.classManagementService.getListLocations();
  }

  ngOnInit(): void {
    this.addBudgetData();
    this.addAuditData();

    console.log('classManagementData: ', this.classManagementData);
    // this.classManagementData.general?.expectedStartDate
    this.addClassFrom.patchValue(this.classManagementData);
  }

  addBudgetData(): void {
    this.budgetData.push({ id: uuidv4() });
    this.budgetTable?.renderRows();
  }

  removeBudgetData(index: number): void {
    this.budgetData.splice(index, 1);
    this.budgetTable?.renderRows();
  }

  addAuditData(): void {
    this.auditData.push({ id: uuidv4() });
    console.log(this.auditData);
    this.auditTable?.renderRows();
  }

  removeAuditData(index: number): void {
    this.auditData.splice(index, 1);
    this.auditTable?.renderRows();
  }

  onclick = () => {
    console.log(this.addClassFrom.value);
  };

  myFiles: string[] = [];
  onFileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }
  }

  onSubmit(values: any) {
    console.log('this.addClassFrom.value');
    const aaaaaa: ClassModel = {
      general: {
        classCode: 'Site_FR_Skill_12_12',
        className: 'Test',
        status: 0,

        plannedTraineeNo: 12,
        acceptedTraineeNo: 'string',
        actualTraineeNo: 'string',

        expectedStartDate: Date.now(),
        expectedEndDate: Date.now(),

        locationID: '0DKSeiH0AaHqm2kAZpsg',
        location: 'Việt Nam',
        detailedLocation:
          'RR75+FPV, Võ Văn Hát, Long Trường, Quận 9, Thành phố Hồ Chí Minh, Việt Nam',

        budgetCode: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
        estimatedBudget: 123,

        classAdmin: [],
        learningPath: '',

        history: '',
      },
      detail: {
        subjectType: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
        subSubjectType: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
        deliveryType: Math.floor(Math.random() * (3 - 0 + 1)) + 0,

        formatType: Math.floor(Math.random() * (2 - 0 + 1)) + 0,
        scope: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
        supplier: 'supplier',

        actualStartDate: Date.now(),
        actualEndDate: Date.now(),

        masterTrainer: 'string',
        trainer: [],

        curriculumn: 'string',
        remarks: 'string',
      },

      budget: [],
      audit: [],
    };
    this.firestore.collection('classManagement').add(aaaaaa);
  }
}
