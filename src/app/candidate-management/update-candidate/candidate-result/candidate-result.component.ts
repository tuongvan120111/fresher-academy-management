import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "app-candidate-result",
  templateUrl: "./candidate-result.component.html",
  styleUrls: ["./candidate-result.component.scss"],
})
export class CandidateResultComponent implements OnInit {
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
  resultOptions = ['Test - Pass', 'Test - Fail']

  @Input()
  resultsForm: FormGroup;

  @Output()
  createNewTestEvent = new EventEmitter<void>();

  @Output()
  deleteEntryRowEvent = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
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
    console.log(this.entriesTest.controls[0].getRawValue(), "<== value")
  }
}
