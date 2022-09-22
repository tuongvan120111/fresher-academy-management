import { ClassStatus } from './../shared/constants/class.contants';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ClassManagementService } from './../shared/services/class-management.service';
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
import { MatPaginator } from '@angular/material/paginator';
import { ClassModel } from '../shared/models/class.model';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss'],
})
export class ClassManagementComponent
  implements OnInit, AfterViewInit, OnChanges
{
  displayedColumns: string[] = [
    'select',
    'id',
    'classCode',
    'className',
    'actualStartDate',
    'actualEndDate',
    'location',
    'status',
  ];
  dataSource = new MatTableDataSource<ClassModel>([]);
  selection = new SelectionModel<ClassModel>(true, []);

  location: SelectData[] = [{ value: 'all', viewValue: 'All' }];
  locationSelected = 'all';

  status: SelectData[] = [{ value: 'all', viewValue: 'All' }];
  statusSelected = 'all';

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ClassModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      (row.id || '') + 1
    }`;
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  isCreateClass: boolean = true;
  isUpdateClass: boolean = true;

  constructor(private classManagementService: ClassManagementService) {}

  ngOnInit(): void {
    this.classManagementService.getListClass().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource<ClassModel>(data);
    });
    // this.classManagementService.getListLocations(
    //   this.paginator.pageIndex,
    //   this.paginator.pageSize
    // );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.classManagementService.getListLocations(
    //   this.paginator.pageIndex,
    //   this.paginator.pageSize
    // );
  }

  ngAfterViewInit() {
    console.log(this.paginator.pageSize);
    this.dataSource.paginator = this.paginator;

    this.paginator.page.subscribe((event) => console.log(event));
  }

  toggleIsCreateClass(isUpdateClass: boolean = false): void {
    this.isCreateClass = !this.isCreateClass;
    this.isUpdateClass = isUpdateClass;
  }

  getStatusClass(status: number = 0): string {
    return ClassStatus[status] || 'None';
  }
}

const ELEMENT_DATA: ClassModel[] = [];

interface SelectData {
  value: string;
  viewValue: string;
}
