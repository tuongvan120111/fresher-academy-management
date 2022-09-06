import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { SelectedItem } from 'src/app/shared/models/common.model';

@Component({
  selector: 'app-selected-item',
  templateUrl: './selected-item.component.html',
  styleUrls: ['./selected-item.component.scss']
})
export class SelectedItemComponent implements OnInit, ControlValueAccessor {
  @Input() dataSource: SelectedItem[] = [];
  @Input() value!: SelectedItem;
  @Input() required!: boolean;

  onChange: (provinceData: any) => void = () => { };
  onTouched: () => void = () => { };
  isDisabled: boolean = false;
  itemSelected!: SelectedItem;

  constructor() { }

  ngOnInit(): void {
    if (this.value) {
      this.itemSelected = this.value;
    }

    this.isDisabled = !this.dataSource || this.dataSource.length === 0
  }

  writeValue(obj: any): void {
    this.itemSelected = obj
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(event: any): void {
    const item = this.dataSource.find((item: SelectedItem) => item.id === event.value);
    this.writeValue(item);
    this.onChange(item);
  }

}
