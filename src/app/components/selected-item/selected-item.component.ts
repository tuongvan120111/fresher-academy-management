import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectedItem } from 'src/app/shared/models/common.model';

@Component({
  selector: 'app-selected-item',
  templateUrl: './selected-item.component.html',
  styleUrls: ['./selected-item.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectedItemComponent),
      multi: true
    }
  ]
})
export class SelectedItemComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() dataSource: SelectedItem[] = [];
  @Input() value!: SelectedItem;
  @Input() required!: boolean;
  @Input() dataSource$!: Observable<SelectedItem[]>;

  onChange: (provinceData: any) => void = () => { };
  onTouched: () => void = () => { };
  isDisabled: boolean = false;
  itemSelected!: SelectedItem;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.value) {
      this.itemSelected = this.value;
    }

    this.isDisabled = !this.dataSource || this.dataSource.length === 0
  }

  ngOnInit(): void {
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
