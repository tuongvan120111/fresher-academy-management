import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { FirebaseCandidateFormat } from "../../candidate.service";
import { ResultsService } from "../../services/results.service";

@Component({
  selector: "app-candidate-result",
  templateUrl: "./candidate-result.component.html",
  styleUrls: ["./candidate-result.component.scss"],
})
export class CandidateResultComponent implements OnInit,OnChanges {
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

  @Input()
  resultsForm: FormGroup;

  @Input()
  candidate: FirebaseCandidateFormat;

  @Output()
  createNewTestEvent = new EventEmitter<void>();

  @Output()
  deleteEntryRowEvent = new EventEmitter<number>();

  constructor(private route: ActivatedRoute, private resultService: ResultsService) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.candidate) {
      this.resultService.loadDataById(this.candidate.employeeId);
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
    console.log(this.entriesTest.controls[0].getRawValue(), "<== value");
  }
}
