import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-c-drop-down",
  templateUrl: "./c-drop-down.component.html",
  styleUrls: ["./c-drop-down.component.scss"],
})
export class CDropDownComponent implements OnInit {
  @Input()
  label: string = "";

  @Input()
  options: string[] = [];

  @Output()
  onValueChange = new EventEmitter<string>();

  showDropdown = false;

  radioValue: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  get isOtherSelected() {
    return this.radioValue === 'Other'
  }

  onChange(value: string) {
    this.onValueChange.emit(value)
  }

  clickedOutside() {
    this.showDropdown = false;
  }
}
