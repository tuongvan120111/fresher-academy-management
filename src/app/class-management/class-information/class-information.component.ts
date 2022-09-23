import { UploadFileService } from './../../shared/services/upload-file.service';
import {
  LocationModel,
  ClassModel,
} from '../../shared/models/class-management.model';
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
import { Observable } from 'rxjs';
import { MatTable } from '@angular/material/table';
import {
  AuditDisplayedColumns,
  BudgetCodeList,
  BudgetDisplayedColumns,
  ClassAdminList,
  DeliveryTypeList,
  FormatTypeList,
  ScopeList,
  SubjectTypeList,
  SubSubjectTypeList,
} from 'src/app/shared/constants/class-management.contants';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-class-information',
  templateUrl: './class-information.component.html',
  styleUrls: ['./class-information.component.scss'],
})
export class ClassInformationComponent implements OnInit {
  @Input() isUpdateClass: boolean = false;
  @Input() classManagementData!: ClassModel;
  @Output() toggleClose = new EventEmitter();

  @ViewChild('budgetTable')
  budgetTable!: MatTable<any>;

  @ViewChild('auditTable')
  auditTable!: MatTable<any>;

  budgetDisplayedColumns: string[] = BudgetDisplayedColumns;
  auditDisplayedColumns: string[] = AuditDisplayedColumns;

  budgetData: Array<any> = [];
  auditData: Array<any> = [];

  learningPathFiles!: File;
  curriculumnFiles!: File;

  budgetCodeList: Array<any> = BudgetCodeList;
  subjectTypeList: Array<any> = SubjectTypeList;
  subSubjectTypeList: Array<any> = SubSubjectTypeList;
  deliveryTypeList: Array<any> = DeliveryTypeList;
  formatTypeList: Array<any> = FormatTypeList;
  scopeList: Array<any> = ScopeList;
  classAdminList: Array<any> = ClassAdminList;

  addClassFrom!: FormGroup;
  locationList!: Observable<LocationModel[]>;
  classAdmin = new FormControl('');

  constructor(
    @Inject(FormBuilder) formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private classManagementService: ClassManagementService,
    private uploadFileService: UploadFileService
  ) {
    this.initData(formBuilder);
  }

  ngOnInit(): void {
    this.addFieldBudgetData();
    this.addFieldAuditData();

    if (this.isUpdateClass) {
      let classData = this.classManagementData;
      classData.general.expectedEndDate = new Date(
        classData.general.expectedEndDate
      );
      classData.general.expectedStartDate = new Date(
        classData.general.expectedStartDate
      );
      classData.detail.actualEndDate = new Date(classData.detail.actualEndDate);
      classData.detail.actualStartDate = new Date(
        classData.detail.actualStartDate
      );

      this.addClassFrom.patchValue(this.classManagementData);
    }
  }

  addFieldBudgetData(): void {
    this.budgetData.push({});
    this.budgetTable?.renderRows();
  }

  removeFieldBudgetData(index: number): void {
    this.budgetData.splice(index, 1);
    this.budgetTable?.renderRows();
  }

  addFieldAuditData(): void {
    this.auditData.push({});
    this.auditTable?.renderRows();
  }

  removeFieldAuditData(index: number): void {
    this.auditData.splice(index, 1);
    this.auditTable?.renderRows();
  }

  onclick = () => {
    console.log(this.addClassFrom.value);
  };

  onFileLearningPathChange(event: any) {
    this.learningPathFiles = event.target.files[0];
    // console.log(this.uploadFileService.uploadFile(this.learningPathFiles));
  }

  onFileCurriculumnChange(event: any) {
    this.curriculumnFiles = event.target.files[0];
  }

  onSubmit(values: any) {
    console.log('this.addClassFrom.value');
    // const aaaaaa: ClassModel = {
    //   general: {
    //     classCode: 'Site_FR_Skill_12_12',
    //     className: 'Test',
    //     status: 0,

    //     plannedTraineeNo: 12,
    //     acceptedTraineeNo: 'string',
    //     actualTraineeNo: 'string',

    //     expectedStartDate: Date.now(),
    //     expectedEndDate: Date.now(),

    //     locationID: '0DKSeiH0AaHqm2kAZpsg',
    //     location: 'Việt Nam',
    //     detailedLocation:
    //       'RR75+FPV, Võ Văn Hát, Long Trường, Quận 9, Thành phố Hồ Chí Minh, Việt Nam',

    //     budgetCode: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
    //     estimatedBudget: 123,

    //     classAdmin: [],
    //     learningPath: '',

    //     history: '',
    //   },
    //   detail: {
    //     subjectType: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
    //     subSubjectType: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
    //     deliveryType: Math.floor(Math.random() * (3 - 0 + 1)) + 0,

    //     formatType: Math.floor(Math.random() * (2 - 0 + 1)) + 0,
    //     scope: Math.floor(Math.random() * (3 - 0 + 1)) + 0,
    //     supplier: 'supplier',

    //     actualStartDate: Date.now(),
    //     actualEndDate: Date.now(),

    //     masterTrainer: 'string',
    //     trainer: [],

    //     curriculumn: 'string',
    //     remarks: 'string',
    //   },

    //   budget: [],
    //   audit: [],
    // };
    // this.firestore.collection('classManagement').add(aaaaaa);
  }

  onClickToggleClose = () => {
    this.toggleClose.emit();
  };

  private initData = (formBuilder: FormBuilder) => {
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
  };
}
