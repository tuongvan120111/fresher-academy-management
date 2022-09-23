import {
  ClassStatus,
  ClassManagementColumns,
} from '../shared/constants/class-management.contants';
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
import { ClassModel } from '../shared/models/class-management.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss'],
})
export class ClassManagementComponent
  implements OnInit, AfterViewInit, OnChanges
{
  displayedColumns: string[] = ClassManagementColumns;
  classData = new MatTableDataSource<ClassModel>([]);
  selection = new SelectionModel<ClassModel>(true, []);

  location: SelectData[] = [{ value: 'all', viewValue: 'All' }];
  locationSelected = 'all';

  status: SelectData[] = [{ value: 'all', viewValue: 'All' }];
  statusSelected = 'all';

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.classData.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      console.log(this.selection);
      return;
    }
    this.selection.select(...this.classData.data);
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

  isCreateClass: boolean = false;
  isUpdateClass: boolean = false;

  constructor(
    private classManagementService: ClassManagementService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.classManagementService.getListClass().subscribe((data: any) => {
      this.classData = new MatTableDataSource<ClassModel>(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit() {
    this.classData.paginator = this.paginator;
  }

  toggleIsCreateClass(): void {
    this.isCreateClass = !this.isCreateClass;
  }

  toggleIsUpdateClass(): void {
    this.isUpdateClass = !this.isUpdateClass;
  }

  getStatusClass(status: number = 0): string {
    return ClassStatus[status] || 'None';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.classManagementService.cancleClass(this.selection.selected[0]);
        this.selection.clear();
      }
    });
  }
}

interface SelectData {
  value: string;
  viewValue: string;
}
