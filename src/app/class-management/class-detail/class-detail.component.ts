import { RoleUser } from 'src/app/shared/constants/common.constants';
import { FileService } from './../../shared/services/file.service';
import { Router } from '@angular/router';
import { UploadFileService } from '../../shared/services/upload-file.service';
import {
  LocationModel,
  ClassModel,
  ClassAdminModel,
  TrainerModel,
  ClassAudit,
} from '../../shared/models/class-management.model';
import { ClassManagementService } from '../../shared/services/class-management.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Component,
  Inject,
  Input,
  IterableDiffers,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  firstValueFrom,
  lastValueFrom,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  AuditDisplayedColumns,
  BudgetCodeList,
  BudgetDisplayedColumns,
  ClassAdminList,
  ClassStatusString,
  DeliveryTypeList,
  EventCategoryList,
  FileFormats,
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
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.scss'],
})
export class NewClassComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  title?: string;
  @Input() classManagementData!: ClassModel;

  @ViewChild('budgetTable')
  budgetTable!: MatTable<any>;

  @ViewChild('auditTable')
  auditTable!: MatTable<any>;

  isLoading: boolean = true;
  isSpinnerLoading: boolean = false;

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
  eventCategoryList = EventCategoryList;

  addClassFrom!: FormGroup;
  locationList!: Observable<LocationModel[]>;

  classAdminList!: Observable<ClassAdminModel[]>;
  classAdmin = new FormControl('');

  masterTrainerList!: Observable<TrainerModel[]>;
  trainer = new FormControl('');

  budgetDataSource!: MatTableDataSource<any>;
  auditDataSource!: MatTableDataSource<any>;

  selectedObjectsFromArray: any;

  generalErrorMessage: string = '';
  detailErrorMessage: string = '';

  userInfor: Authentications | undefined;

  isDisabled: boolean = false;

  totalBudget: number = 0;

  fileFormats = FileFormats;

  learningPathData?: {
    typeOfClass: string;
    skillOfClass: string;
    position: string;
  };

  MAX_SAFE_INTEGER: number = Number.MAX_SAFE_INTEGER;
  isUpdateData: boolean = false;

  classID: string = '';
  dataClass: Observable<ClassModel> = new Observable<any>();

  constructor(
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    public classManagementService: ClassManagementService,
    private uploadFileService: UploadFileService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    private commonSer: CommonService,
    private fileService: FileService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.initData(formBuilder);
    this.userInfor = commonSer.getCurrentUser();
    this.isUpdateData = this.router.url.includes('/update');
    this.classID = activatedRoute.snapshot.paramMap.get('id') || '';

    if (
      this.isUpdateData &&
      ![
        RoleUser.FAManager,
        RoleUser.DeliveryManager,
        RoleUser.ClassAdmin,
        RoleUser.SystemAdmin,
      ].includes(this.userInfor?.role || 0)
    ) {
      this.isDisabled = true;
      this.addClassFrom.disable();
      this.showDialog(
        'Notification',
        `You Do Not Have Permission To Access`,
        `/class-management/${this.classID}`
      );
    }
  }

  ngOnInit(): void {
    this.addClassFrom.reset();
    this.budgetDataSource = new MatTableDataSource(this.budgets.controls);
    this.auditDataSource = new MatTableDataSource(this.audits.controls);
    this.isLoading = true;

    this.isDisabled = !(!this.classID || this.router.url.includes('/update'));

    if (this.isDisabled) {
      this.addClassFrom.disable();
    }

    if (!this.classID) {
      this.title = 'Create Class';
      this.isLoading = false;
      return;
    }
    this.title = 'View Class';

    if (this.router.url.includes('/update')) {
      this.title = 'Update Class';
    }
    this.dataClass = this.classManagementService.getClassByID(this.classID);
    this.dataClass.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ClassModel) => {
        if (!data) {
          this.showDialog(
            'Not found',
            `Not found class with id: ${this.classID}`,
            '/class-management'
          );
          return;
        }
        data.general.expectedEndDate = new Date(data.general.expectedEndDate);
        data.general.expectedStartDate = new Date(
          data.general.expectedStartDate
        );
        if (!!data.detail.actualEndDate) {
          data.detail.actualEndDate = new Date(data.detail.actualEndDate);
        }
        if (!!data.detail.actualStartDate) {
          data.detail.actualStartDate = new Date(data.detail.actualStartDate);
        }

        let auditData: ClassAudit[] = [];
        data.audit.map((audit) => {
          audit.deadline = new Date(audit.deadline);
          audit.date = new Date(audit.date);
          auditData.push(audit);
        });

        data.audit = auditData;

        this.classManagementData = data;

        this.selectedObjectsFromArray =
          this.classManagementData.general.classAdmin;

        this.getDataFormArray(
          data.budget,
          this.budgets,
          this.budgetTable,
          true
        );

        this.getDataFormArray(data.audit, this.audits, this.auditTable);

        if (data.budget.length > 0) {
          this.totalBudget = data.budget
            .map(
              (bud) => bud.unitExpense * bud.quantity * (1 + bud.tax / 100.0)
            )
            .reduce((a, b) => a + b);
        }

        if (this.router.url.includes('/update')) {
          this.addClassFrom.disable();
          switch (data.general.status) {
            case ClassStatusString.Draft:
              this.generals.enable();
              this.details.enable();
              this.budgets.enable();
              this.auditDisplayedColumns = this.auditDisplayedColumns.filter(
                (item) => item !== 'add'
              );
              this.budgetDisplayedColumns.includes('add')
                ? ''
                : this.budgetDisplayedColumns.unshift('add');
              break;
            case ClassStatusString.InProgress:
              this.audits.enable();

              this.auditDisplayedColumns.includes('add')
                ? ''
                : this.auditDisplayedColumns.unshift('add');
              this.budgetDisplayedColumns = this.budgetDisplayedColumns.filter(
                (item) => item !== 'add'
              );
              break;

            default:
              this.auditDisplayedColumns = this.auditDisplayedColumns.filter(
                (item) => item !== 'add'
              );
              this.budgetDisplayedColumns = this.budgetDisplayedColumns.filter(
                (item) => item !== 'add'
              );
              break;
          }
        }

        this.addClassFrom?.patchValue(this.classManagementData);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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

  onFileLearningPathChange = async (event: any) => {
    const file = event.target.files[0] as File;
    if (!file) {
      return;
    }
    const extension = file.name.split('.').pop() || '';
    if (!this.fileFormats.includes(`.${extension}`)) {
      alert('Sai định dạng file');
      return;
    }
    this.learningPathFiles = file;
    this.generals.get('learningPath')?.setValue(file.name);
    this.learningPathData = await this.fileService.getFileData(file);
  };

  onFileCurriculumnChange(event: any) {
    this.curriculumnFiles = event.target.files[0];
    this.details
      .get('curriculumn')
      ?.setValue(this.curriculumnFiles?.name || '');
  }

  onSubmit(values: ClassModel) {
    if (this.isDisabled) {
      this.showDialog(
        'Notification',
        `You Do Not Have Permission To Access`,
        `/class-management/${this.classID}`
      );
      return;
    }
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
        message: `Are you sure ${this.isUpdateData ? 'update' : 'add'} class?`,
        buttons: 'OK',
        iconColor: 'green',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (result) => {
        if (result) {
          this.isSpinnerLoading = true;
          if (this.learningPathFiles) {
            const locationID = values.general.location;
            const location = await firstValueFrom(
              this.classManagementService.getLocationByID(locationID)
            );
            // TODO: Còn Serial number of skill
            values.general.classCode = `${location.acronym}_${
              this.learningPathData?.typeOfClass
            }_${
              this.learningPathData?.skillOfClass
            }_${this.commonSer.getTwoDigitYear(
              new Date(values.general.expectedStartDate)
            )}_12`;
            values.general.className = `Fresher ${this.learningPathData?.position} ${this.learningPathData?.skillOfClass}`;
          }

          try {
            if (this.isUpdateData) {
              const { general, detail, budget, audit } = values;

              if (!audit) {
                this.classManagementData.audit = audit;
              } else {
                this.classManagementData.general = general;
                this.classManagementData.detail = detail;
                this.classManagementData.budget = budget;
              }
              // let status = ClassStatusString.Updated;
              // if (
              //   !(
              //     isEqual(general, oldGeneral) &&
              //     isEqual(detail, oldDetail) &&
              //     isEqual(budget, oldBudget)
              //   )
              // ) {
              //   status = ClassStatusString.Draft;
              // }
              // if (!isEqual(audit, oldAudit)) {
              //   status = ClassStatusString.InProgress;
              // }
              await this.classManagementService.updateStatusClass(
                this.classID,
                this.classManagementData,
                ClassStatusString.Updated,
                ClassStatusString.Updated
              );
              this.notificationService.success('Update successfully');
              this.router.navigateByUrl(`/class-management/${this.classID}`);
            } else {
              await this.classManagementService.addNewClass(values);
              this.notificationService.success('Create successfully');
              this.router.navigateByUrl('/class-management');
            }

            this.isSpinnerLoading = false;
          } catch (error) {
            this.isSpinnerLoading = false;
            this.notificationService.error('Create failure: ' + error);
          }
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
        location: [null, Validators.required],
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
        actualStartDate: [0],
        actualEndDate: [0],
        masterTrainer: [''],
        trainer: [[]],
        curriculumn: [''],
        remarks: [0],
      }),

      budget: formBuilder.array([]),
      audit: formBuilder.array([]),
    });
    this.locationList = this.classManagementService.getListLocations();
    this.classAdminList = this.classManagementService.getListClassAdmins();
    this.masterTrainerList =
      this.classManagementService.getListMasterTrainers();
  };

  private initBudget() {
    const index: number = this.budgets.length;
    return this.formBuilder.group({
      item: [`Item_${index + 1}`, Validators.required],
      unit: [`Unit_${index + 1}`, Validators.required],
      unitExpense: [0, Validators.required],

      quantity: [1, Validators.required],
      amount: [0, Validators.required],
      tax: [0, Validators.required],

      sum: [0, Validators.required],
      note: [`Note_${index + 1}`],
    });
  }

  private initAudit() {
    const index: number = this.audits.length;
    return this.formBuilder.group({
      date: [new Date()],
      eventCategory: ['Trainer'],
      relatedPeople: [`Related_People_${index + 1}`],

      action: [`Action_${index + 1}`],
      pic: [`PIC_${index + 1}`],
      deadline: [new Date()],

      note: [`Note_${index + 1}`],
    });
  }

  private getDataFormArray(
    list: Array<any>,
    form: FormArray<any>,
    table: MatTable<any>,
    isBudget: boolean = false
  ) {
    form.clear();
    form.patchValue(list);
    const length = list.length;
    for (let index = 0; index < length; index++) {
      form?.push(isBudget ? this.initBudget() : this.initAudit());
    }
    try {
      table?.renderRows();
    } catch (error) {}
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

  showDialog(title: string, mess: string, navigate: string) {
    const dialogRef = this.dialog.open(DialogSizeSComponent, {
      width: '450px',
      data: {
        icon: ['info'],
        title: title,
        message: mess,
        buttons: 'OK',
        iconColor: 'red',
        isOneButton: true,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (result) => {
        if (result) {
          this.router.navigateByUrl(navigate);
        }
      });
  }

  validateInputNumber(event: KeyboardEvent) {
    const regex = /[^\e\-\+\.]/g;
    const { max, value } = event.target as HTMLInputElement;

    const currentValue = new Number(value + event.key);
    if (!regex.test(event.key) || (!!max && new Number(max) <= currentValue))
      event.preventDefault();
  }

  setSpinnerLoading(val: boolean = true) {
    this.isSpinnerLoading = val;
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
