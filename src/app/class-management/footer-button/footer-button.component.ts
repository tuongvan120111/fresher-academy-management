import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-button',
  templateUrl: './footer-button.component.html',
  styleUrls: ['./footer-button.component.scss'],
})
export class FooterButtonComponent implements OnInit {
  routerURI!: string;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerURI = this.router.url;
  }
}
