import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestExerciseMember } from 'src/app/domain/test/test-exercise-member';
import { StatusTest, TestMember } from 'src/app/domain/test/test-member';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  id: number;
  testMember: TestMember;

  constructor(private testService: TestService,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(
        params => {this.id = parseInt(params['id'])}
      )
     }

  ngOnInit() {
    this.getTest();
  }

  getTest(){
    this.testService.getById(this.id).subscribe(
      response => {

        this.testMember = response.result;
      },
      error => console.error(error)
    )
  }

}
