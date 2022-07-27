import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestResult } from 'src/app/domain/test/test-result';
import { MemberService } from 'src/app/services/member.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {

  memberId: number;
  id: number;
  testResults: TestResult[] = [];
  urlBase: string;
  requestingResult: boolean;
  levelTest: number;
  member: string;

  constructor(private route: ActivatedRoute,
    private testService: TestService,
    private memberService: MemberService) {
    this.route.queryParams.subscribe(
      params => {
        this.id = parseInt(params['id']);
        this.levelTest = parseInt(params['level']);
        this.requestingResult = true;
        this.getMember();
        this.getResult();
      });
    this.urlBase = this.testService.url;
  }

  ngOnInit() {
  }

  getMember() {
    this.memberService.getById().subscribe(
      response => {
        console.log("socio: ", response);
        this.member = response.lastName + " " + response.name;
      },
      error => console.error)
  }

  getResult() {
    this.testService.getResult(this.id).subscribe(
      response => {
        console.log("resultados: ", response.result);
        this.testResults = response.result;
        
        this.requestingResult = false;
      },
      error => {
        console.error(error);
        this.requestingResult = false;
      }
    )
  }
}
