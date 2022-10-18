import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { FirebaseCandidateFormat } from "../../candidate.service";
import { ResultsService } from "../../services/results.service";
import { map, Observable, Subject, tap } from "rxjs";
import { IResult, TEST_STATUS } from "../../model/result.interface";
import { UtilService } from "../../utils/util.service";
import { IFirebaseDate } from "../../model/candidate.interface";

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
  deleteEntryRowEvent = new EventEmitter<number>();

  entryResults$: Observable<IResult<Date>[]> = new Subject();
  constructor(
    private route: ActivatedRoute,
    private resultService: ResultsService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.utilService._generateAccountName("Phan Thanh Hoang");
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.candidate) {
      this.entryResults$ = this.resultService.loadDataById(
        this.candidate.employeeId
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
              if(index > this.entriesTest.length - 1) {
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
          })
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

  toggleEntryTest() {
    this.isShowEntryTest = !this.isShowEntryTest;
  }

  onRemoveEntryRow(index: number) {
    this.deleteEntryRowEvent.emit(index);
  }

  submit() {
    this.entriesTest.controls.forEach((control, index) => {
      const formValue = control.getRawValue();
      const data: IResult<IFirebaseDate> = {
        ...formValue,
        time: this.utilService._formatFirebaseDate(formValue.time),
        Date: this.utilService._formatFirebaseDate(formValue.date),
        employeeId: this.candidate.employeeId
      };
      if (index <= this.resutIds.length - 1) {
        this.resultService.updateResultById(this.resutIds[index], data);
      } else {
        this.resultService.createResult(data);
      }
    });
  }
}
