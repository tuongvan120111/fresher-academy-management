import { FileService } from './../../shared/services/file.service';
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
  EventCategoryList,
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
import { CurrencyPipe } from '@angular/common';
import { Authentications } from 'src/app/shared/models/common.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSizeSComponent } from 'src/app/components/dialog-size-s/dialog-size-s.component';

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

  currentDate = new Date();

  matcher = new MyErrorStateMatcher();

  budgetDisplayedColumns: string[] = BudgetDisplayedColumns;
  auditDisplayedColumns: string[] = AuditDisplayedColumns;

  budgetData: Array<any> = [];
  auditData: Array<any> = [];

  learningPathFiles!: File;
  curriculumnFiles!: File;

  budgetCodeList = BudgetCodeList;
  subjectTypeList = SubjectTypeList;
  subSubjectTypeList = SubSubjectTypeList;
  deliveryTypeList = DeliveryTypeList;
  formatTypeList = FormatTypeList;
  scopeList = ScopeList;
  classAdminList = ClassAdminList;
  eventCategoryList = EventCategoryList;

  addClassFrom!: FormGroup;
  locationList!: Observable<LocationModel[]>;
  classAdmin = new FormControl('');

  budgetDataSource!: MatTableDataSource<any>;
  auditDataSource!: MatTableDataSource<any>;

  selectedObjectsFromArray: any;

  generalErrorMessage: string = '';
  detailErrorMessage: string = '';

  userInfor: Authentications | undefined;

  isDisabled: boolean = false;

  totalBudget: number = 0;

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    public classManagementService: ClassManagementService,
    private uploadFileService: UploadFileService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    commonSer: CommonService,
    private fileService: FileService,
    private dialog: MatDialog
  ) {
    this.initData(formBuilder);
    this.userInfor = commonSer.getCurrentUser();
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

          this.selectedObjectsFromArray =
            this.classManagementData.general.classAdmin;

          this.getDataFormArray(
            this.classManagementData.budget,
            this.budgets,
            this.budgetTable
          );

          this.getDataFormArray(
            this.classManagementData.audit,
            this.audits,
            this.auditTable
          );

          this.addClassFrom.disable();
          this.addClassFrom.patchValue(this.classManagementData);
          this.isLoading = false;

          this.isDisabled = true;
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
    this.generals
      .get('learningPath')
      ?.setValue(this.learningPathFiles?.name || '');

    this.fileService
      .getFileData(this.learningPathFiles)
      .then((data: any) => {
        // TODO: Generate Class name - Name format: Fresher Position Skill
        this.generals
          .get('className')
          ?.setValue(`Fresher ${data.position} ${data.skill}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onFileCurriculumnChange(event: any) {
    this.curriculumnFiles = event.target.files[0];
    this.details
      .get('curriculumn')
      ?.setValue(this.curriculumnFiles?.name || '');
  }

  onSubmit(values: any) {
    this.generalErrorMessage = '';
    const generalKeys: {
      [key: string]: string;
    } = {
      expectedStartDate: 'Expected Start Date',
      expectedEndDate: 'Expected End Date',
      location: 'Location',
      budgetCode: 'Budget Code',
      estimatedBudget: 'Estimated Budget',
      classAdmin: 'Class Admin',
      learningPath: 'Learning Path',
    };
    for (const [key, val] of Object.entries(generalKeys)) {
      for (const [errorKey, _] of Object.entries(
        this.generals.get(key)?.errors || {}
      )) {
        this.generalErrorMessage +=
          val +
          ' ' +
          ValidationService.getValidatorErrorMessage(errorKey) +
          ', ';
      }
    }

    this.generalErrorMessage = this.generalErrorMessage.slice(0, -2);
    if (!!this.generalErrorMessage.trim()) {
      return;
    }

    const dialogRef = this.dialog.open(DialogSizeSComponent, {
      width: '450px',
      data: {
        icon: ['info'],
        title: 'Confirm',
        message: 'Are you sure add class?',
        buttons: 'OK',
        iconColor: 'green',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.classManagementService.addNewClass(values);
      }
    });
  }

  get generals() {
    return this.addClassFrom.controls['general'] as FormControl;
  }

  get details() {
    return this.addClassFrom.controls['detail'] as FormControl;
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
        plannedTraineeNo: [1],
        acceptedTraineeNo: [''],
        actualTraineeNo: [''],
        expectedStartDate: [new Date(), Validators.required],
        expectedEndDate: [new Date(), Validators.required],
        location: ['Việt Nam', Validators.required],
        detailedLocation: [''],
        budgetCode: [null, Validators.required],
        estimatedBudget: [null, Validators.required],
        classAdmin: [null, Validators.required],
        learningPath: ['', Validators.required],
        history: [''],
      }),

      detail: formBuilder.group({
        subjectType: [0],
        subSubjectType: [0],
        deliveryType: [0],
        formatType: [0],
        scope: [0],
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

      action: [''],
      pic: [''],
      deadline: [new Date()],

      note: [''],
    });
  }

  private getDataFormArray(
    list: Array<any>,
    form: FormArray<any>,
    table: MatTable<any>
  ) {
    const length = list.length;
    if (length === 0) {
      form?.removeAt(0);
      return;
    }
    for (let index = 0; index < length - 1; index++) {
      form?.push(this.initBudget());
    }
    form?.patchValue(list);
    table?.renderRows();
  }

  transformAmount(element: any) {
    const val = element.get('amount')?.value;
    return this.currencyPipe.transform(val, '0');
  }

  onChangeExpectedStartDate(event: { value: Date }) {
    const chooseDate = event.value;
    if (chooseDate > this.generals.get('expectedEndDate')?.value) {
      this.generals.get('expectedEndDate')?.setValue(chooseDate);
    }
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
