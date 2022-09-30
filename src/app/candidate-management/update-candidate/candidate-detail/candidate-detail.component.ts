import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseCandidateFormat } from "../../candidate.service";

@Component({
  selector: "app-candidate-detail",
  templateUrl: "./candidate-detail.component.html",
  styleUrls: ["./candidate-detail.component.scss"],
})
export class CandidateDetailComponent implements OnInit {
  @Input()
  candidate: FirebaseCandidateFormat;

  constructor(private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    console.log(this.candidate, "<== candidate");
  }

  goBack() {
    this.router.navigate(["candidate-management"]);
  }
}
