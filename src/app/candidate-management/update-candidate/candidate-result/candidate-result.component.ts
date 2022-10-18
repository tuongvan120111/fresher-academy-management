import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { FirebaseCandidateFormat } from "../../candidate.service";
import { ResultsService } from "../../services/results.service";
import { map, Observable, of, Subject, switchMap, tap } from "rxjs";
import { IResult } from "../../model/result.interface";
import { UtilService } from "../../utils/util.service";
import { IFirebaseDate } from "../../model/candidate.interface";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-candidate-result",
  templateUrl: "./candidate-result.component.html",
  styleUrls: ["./candidate-result.component.scss"],
})
export class CandidateResultComponent implements OnInit, OnChanges {
  cols = [
    "Time",
    "Date",
    "Language Valuator",
    "Language Point",
    "Technical Valuator",
    "Technical Point",
    "Result",
  ];

  interviewCols = [
    "Time",
    "Date",
    "Interview",
    "Comment",
    "Result",
  ];

  isShowEntryTest: boolean = true;
  maxDate = moment(new Date()).format("YYYY-MM-DD");
  resultOptions = ["Test - Pass", "Test - Fail"];
  resutIds = [];

  @Input()
  resultsForm: FormGroup;

  @Input()
  candidate: FirebaseCandidateFormat;

  @Output()
  createNewTestEvent = new EventEmitter<void>();

  @Output()
  createNewInterviewRow = new EventEmitter<void>();

  @Output()
  deleteEntryRowEvent = new EventEmitter<number>();

  @Output()
  deleteInterviewRowEvent = new EventEmitter<number>();

  entryResults$: Observable<IResult<Date>[]> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private resultService: ResultsService,
    private utilService: UtilService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.utilService._generateAccountName("Phan Thanh Hoang");
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.candidate) {
      this.entryResults$ = this.resultService.loadDataById(
        this.candidate.employeeId,
      );
      this.entryResults$
        .pipe(
          map((value) => {
            return value.map((entryTest) => {
              return {
                ...entryTest,
                time: moment(entryTest.time).format("MM/DD/YYYY"),
                Date: moment(entryTest.Date).format("YYYY-MM-DD"),
              };
            });
          }),
          tap((entries) => {
            entries.forEach((entry, index) => {
              this.resutIds.push(entry.id);
              if (index > this.entriesTest.length - 1) {
                this.createNewTestEvent.emit();
              }

              this.entriesTest.controls[index].patchValue({
                time: entry.time,
                date: entry.Date,
                languageValuator: entry.languageValuator,
                languagePoint: entry.languagePoint,
                technicalValuator: entry.technicalValuator,
                technicalPoint: entry.technicalPoint,
                result: entry.result,
              });
            });
          }),
        )
        .subscribe();
    } else {
      //TODO: Do something with create status
    }
  }

  onCreateNewEntryRow() {
    this.createNewTestEvent.emit();
  }

  get entriesTest() {
    return this.resultsForm.get("entriesTest") as FormArray;
  }

  get interviews() {
    return this.resultsForm.get("interviews") as FormArray;
  }

  toggleEntryTest() {
    this.isShowEntryTest = !this.isShowEntryTest;
  }

  onRemoveEntryRow(index: number) {
    this.resultService.deleteResult(this.resutIds[index]);
    this.deleteEntryRowEvent.emit(index);
  }

  submit() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
    });
    dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (result.ok) {
          this.entriesTest.controls.forEach((control, index) => {
            const formValue = control.getRawValue();
            const data: IResult<IFirebaseDate> = {
              ...formValue,
              time: this.utilService._formatFirebaseDate(formValue.time),
              Date: this.utilService._formatFirebaseDate(formValue.date),
              employeeId: this.candidate.employeeId,
            };
            if (index <= this.resutIds.length - 1) {
              return this.resultService.updateResultById(this.resutIds[index], data);
            } else {
              return this.resultService.createResult(data);
            }
          });
        }
        return of(null);
      }),
    ).subscribe();
  }

  onCreateNewInterviewRow() {
    this.createNewInterviewRow.emit();
  }

  onRemoveInterviewRow(i: number) {
    this.deleteInterviewRowEvent.emit(i);
  }
}
