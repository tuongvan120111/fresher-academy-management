import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-c-drop-down",
  templateUrl: "./c-drop-down.component.html",
  styleUrls: ["./c-drop-down.component.scss"],
})
export class CDropDownComponent implements OnInit {
  @Input()
  label: string = "";

  @Input()
  defaultValue: string;

  @Input()
  options: any[] = [];

  @Output()
  onValueChange = new EventEmitter<string>();

  showDropdown = false;

  radioValue: string;

  otherValue: string = "";

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  get isOtherSelected() {
    return this.radioValue === "Other";
  }

  clickedOutside() {
    this.showDropdown = false;
  }

  get finalValue(): string {
    return this.radioValue !== "Other" ? this.radioValue : "";
  }

  changeValue() {
    if (this.otherValue) {
      this.radioValue = this.otherValue;
      this.otherValue = "";
    }
    this.onValueChange.emit(this.radioValue || this.defaultValue);
  }
}
