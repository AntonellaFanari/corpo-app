import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TestMember } from 'src/app/domain/test/test-member';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-fms-evaluation',
  templateUrl: './fms-evaluation.component.html',
  styleUrls: ['./fms-evaluation.component.scss'],
})
export class FmsEvaluationComponent implements OnInit {
  id: number;

  constructor(private route: ActivatedRoute,
    private testMember: TestService) {
    this.route.queryParams.subscribe(
      params => {
        this.id = parseInt(params['id']);
        this.getExerciseFms(this.id);
      });
  }

  ngOnInit() { }

  getExerciseFms(id) {
    this.testMember.getExerciseFms(id).subscribe(
      response => {
        console.log("ejercicio fms: ", response.result);
      },
      error => console.error(error)
    )
  }

}
