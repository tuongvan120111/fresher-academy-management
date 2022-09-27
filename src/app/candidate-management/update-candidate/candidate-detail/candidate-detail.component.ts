import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CandidateService, FirebaseCandidateFormat } from "../../candidate.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {
  employeeId: string = '';
  candidate$: Observable<FirebaseCandidateFormat | undefined> = new Observable();

  constructor(private router: Router, private route: ActivatedRoute, private candidateService: CandidateService) {

  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.queryParams['id'];
    this.candidateService.getCandidateById(this.employeeId).subscribe((val: any) => console.log(val, "<== candidateID"));
    this.candidateService.candidateStore$.subscribe(console.log)
  }

  goBack() {
    this.router.navigate(["candidate-management"])
  }
}
