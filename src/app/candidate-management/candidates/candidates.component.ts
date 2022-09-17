import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit, AfterViewInit {
  @ViewChild('selectAll', {read: ElementRef}) checkbox: ElementRef<HTMLInputElement> | undefined;
  isSelectedAll: boolean = false;
  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  toggleSelected() {
    this.isSelectedAll = !this.isSelectedAll;
  }
}
