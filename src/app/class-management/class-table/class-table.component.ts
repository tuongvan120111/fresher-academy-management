import { ClassFilter } from './../../shared/models/class-management.model';
import { RoleUser } from 'src/app/shared/constants/common.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { Authentications } from 'src/app/shared/models/common.model';
import { ClassManagementService } from '../../shared/services/class-management.service';

import {
  AfterViewInit,
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import {
  ClassManagementColumns,
  ClassStatusString,
} from 'src/app/shared/constants/class-management.contants';
import {
  ClassModel,
  LocationModel,
} from 'src/app/shared/models/class-management.model';
import { DialogSizeSComponent } from 'src/app/components/dialog-size-s/dialog-size-s.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-class-table',
  templateUrl: './class-table.component.html',
  styleUrls: ['./class-table.component.scss'],
})
export class ClassTableComponent implements OnInit, AfterViewInit, OnChanges {
  private userInfo: Authentications | undefined;
  displayedColumns: string[] = ClassManagementColumns;
  classData = new MatTableDataSource<ClassModel>([]);
  selection = new SelectionModel<ClassModel>(true, []);

  location!: LocationModel[];

  isLoading: boolean = true;
  isMeetConditionShowCancelButton: boolean = false;

  classStatus = {};
  searchData!: FormGroup;
  paganationData = {
    pageSize: 5,
    pageIndex: 0,
  };

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.classData.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.classData.data);
  }

  temp: boolean = false;
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ClassModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    if (this.selection.isSelected(row)) {
      this.temp = [
        ClassStatusString.Draft,
        ClassStatusString.Submitted,
      ].includes(row.general.status);
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      (row.id || '') + 1
    }`;
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  isCreateClass: boolean = false;
  isUpdateClass: boolean = false;

  constructor(
    private classManagementService: ClassManagementService,
    private commonSer: CommonService,
    private dialog: MatDialog,
    formBuilder: FormBuilder
  ) {
    this.userInfo = this.commonSer.getCurrentUser();
    const role = this.userInfo?.role || 0;
    this.isMeetConditionShowCancelButton = [
      RoleUser.SystemAdmin,
      RoleUser.FAManager,
      RoleUser.DeliveryManager,
    ].includes(role);

    this.initSearchForm(formBuilder);
    this.classManagementService.getListClass().then((data) => {
      this.isLoading = false;
      this.classData = new MatTableDataSource<ClassModel>(data);
      this.classData.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    // .subscribe({
    //   next: (data) => {
    //     this.isLoading = false;
    //     this.classData = new MatTableDataSource<ClassModel>(data);
    //   },
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit() {
    this.classData.paginator = this.paginator;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogSizeSComponent, {
      width: '450px',
      data: {
        icon: ['info'],
        title: 'Confirm',
        message: 'Do you want to cancel class?',
        buttons: 'Ok',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const data = this.selection.selected[0];
        await this.classManagementService.updateStatusClass(
          data.id || '',
          data,
          ClassStatusString.Canceled
        );
        this.selection.clear();
      }
    });
  }

  handlePageEvent(event: PageEvent) {
    const { pageSize, pageIndex } = event;
    this.paganationData = {
      pageSize,
      pageIndex,
    };
  }

  cancelClass() {
    const dialogRef = this.dialog.open(DialogSizeSComponent, {
      width: '450px',
      data: {
        icon: ['info'],
        title: 'Confirm',
        message: 'Are you sure to cancel?',
        iconColor: 'green',
        buttons: 'OK',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selection.selected.forEach((data: ClassModel) => {
          this.classManagementService.updateStatusClass(
            data.id || '',
            data,
            ClassStatusString.Canceled
          );
        });
      }
    });
  }

  private initSearchForm = (formBuilder: FormBuilder) => {
    this.searchData = formBuilder.group({
      location: ['All'],
      name: [''],
      status: ['All'],
      fromDate: [],
      toDate: [],
    });
    this.classManagementService
      .getListLocations()
      .pipe(
        tap((data) => {
          data.unshift({
            id: 'All',
            name: 'All',
          });
        })
      )
      .subscribe((data) => (this.location = data));

    this.classStatus = {
      All: 'All',
      ...ClassStatusString,
    };
  };

  search(value: ClassFilter) {
    this.isLoading = true;

    const { pageSize, pageIndex } = this.paganationData;
    this.selection.clear();
    this.classData = new MatTableDataSource<ClassModel>([]);
    this.classManagementService
      .getListClass(
        this.paganationData.pageIndex,
        this.paganationData.pageSize,
        value
      )
      .then((data) => {
        this.isLoading = false;
        this.classData = new MatTableDataSource<ClassModel>(data);
        this.classData.paginator = this.paginator;
      });
  }

  private datePipe = new DatePipe('en-US');
  convertNumberToDate(val: number) {
    return this.datePipe.transform(val, 'yyyy-MM-ddTHH:mm');
    // return val;
  }
}

interface SelectData {
  value: string;
  viewValue: string;
}
