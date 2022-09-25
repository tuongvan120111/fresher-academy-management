import { Router } from '@angular/router';
import { UploadFileService } from '../../shared/services/upload-file.service';
import {
  LocationModel,
  ClassModel,
} from '../../shared/models/class-management.model';
import { ClassManagementService } from '../../shared/services/class-management.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { from, Observable } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { ValidationService } from 'src/app/shared/services/validation.service';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.scss'],
})
export class NewClassComponent implements OnInit {
  @Input() classManagementData!: ClassModel;

  @ViewChild('budgetTable')
  budgetTable!: MatTable<any>;

  @ViewChild('auditTable')
  auditTable!: MatTable<any>;

  isLoading: boolean = true;

  matcher = new MyErrorStateMatcher();

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

  budgetDataSource!: MatTableDataSource<any>;
  auditDataSource!: MatTableDataSource<any>;

  selectedObjectsFromArray: any;

  generalErrorMessage: string = '';
  detailErrorMessage: string = '';

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private classManagementService: ClassManagementService,
    private uploadFileService: UploadFileService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initData(formBuilder);
  }

  ngOnInit(): void {
    this.budgetDataSource = new MatTableDataSource(this.budgets.controls);
    this.auditDataSource = new MatTableDataSource(this.audits.controls);

    this.activatedRoute.params.subscribe((params) => {
      this.isLoading = true;
      if (!params['id']) {
        this.isLoading = false;
        return;
      }
      this.classManagementService.getClassByID(params['id'] || '').subscribe({
        next: (data) => {
          data.general.expectedEndDate = new Date(data.general.expectedEndDate);
          data.general.expectedStartDate = new Date(
            data.general.expectedStartDate
          );
          data.detail.actualEndDate = new Date(data.detail.actualEndDate);
          data.detail.actualStartDate = new Date(data.detail.actualStartDate);

          this.classManagementData = data;

          this.isLoading = false;

          this.selectedObjectsFromArray =
            this.classManagementData.general.classAdmin;

          this.addClassFrom.patchValue(data);
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
    });
  }

  addFieldBudgetData(): void {
    this.budgets?.push(this.initBudget());
    this.budgetTable?.renderRows();
  }

  removeFieldBudgetData(index: number): void {
    this.budgets?.removeAt(index);
    this.budgetTable?.renderRows();
  }

  addFieldAuditData(): void {
    this.audits?.push(this.initAudit());
    this.auditTable?.renderRows();
  }

  removeFieldAuditData(index: number): void {
    this.audits?.removeAt(index);
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
    this.generalErrorMessage = '';
    const generalKeys: {
      [key: string]: string;
    } = {
      expectedStartDate: 'Expected Start Date',
      expectedEndDate: 'Expected End Date',
      locationID: 'Location',
      budgetCode: 'Budget Code',
      estimatedBudget: 'Estimated Budget',
      // classAdmin: 'Class Admin',
      // learningPath: 'Learning Path',
    };
    for (const [key, val] of Object.entries(generalKeys)) {
      for (const [errorKey, _] of Object.entries(
        this.generals.get(key)?.errors || {}
      )) {
        console.log(errorKey);
        this.generalErrorMessage +=
          val +
          ' ' +
          ValidationService.getValidatorErrorMessage(errorKey) +
          ', ';
        //  + '\n';
      }
    }

    if (
      !this.selectedObjectsFromArray ||
      this.selectedObjectsFromArray.length === 0
    ) {
      this.generalErrorMessage +=
        'Class Admin ' +
        ValidationService.getValidatorErrorMessage('required') +
        ', ';
    }

    if (!this.learningPathFiles) {
      this.generalErrorMessage +=
        'Learning Path ' +
        ValidationService.getValidatorErrorMessage('required') +
        ', ';
    }
    this.generalErrorMessage = this.generalErrorMessage.slice(0, -2);
    // generalErrorMessage+=this.generals.get('budgetCode')?.errors
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

  get generals(): any {
    return this.addClassFrom.controls['general'] as FormArray;
  }

  get budgets() {
    return this.addClassFrom.controls['budget'] as FormArray;
  }

  get audits() {
    return this.addClassFrom.controls['audit'] as FormArray;
  }

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

      budget: formBuilder.array([this.initBudget()]),
      audit: formBuilder.array([this.initAudit()]),
    });
    this.locationList = this.classManagementService.getListLocations();
  };

  private initBudget() {
    return this.formBuilder.group({
      item: [''],
      unit: [''],
      unitExpense: [''],

      quantity: [''],
      amount: [''],
      tax: [''],

      sum: [''],
      note: [''],
    });
  }

  private initAudit() {
    return this.formBuilder.group({
      date: [new Date()],
      eventCategory: [''],
      relatedPeople: [''],

      action: [0],
      pic: [0],
      deadline: [new Date()],

      note: [''],
    });
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return isSubmitted ? !!control?.errors : false;
  }
}
