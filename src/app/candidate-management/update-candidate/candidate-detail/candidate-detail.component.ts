import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {
  employeeId: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.employeeId = this.route.snapshot.queryParams['id']
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate(["candidate-management"])
  }
}
