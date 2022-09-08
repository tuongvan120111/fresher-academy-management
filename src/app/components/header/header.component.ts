import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title: string = 'FOSFT HR UTILITY';
  name!: string;
  buzUnit!: string;

  constructor() { }

  ngOnInit(): void {
    this.name = 'Tăng Tường Vân';
    this.buzUnit = 'FHM.CMS'
  }

}
