import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestResult } from 'src/app/domain/test/test-result';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {

  memberId: number;
  id: number;
  url = 'https://www.youtube.com/watch?v=KtZsQrYAJ0Y';
  testResults: TestResult[] = [];
  urlBase: string;
  requestingResult: boolean;

  constructor(private route: ActivatedRoute,
    private testService: TestService) {
    this.route.queryParams.subscribe(
      params => {
        this.id = parseInt(params['id']);
        this.memberId = parseInt(params['memberId']);
        this.getResult();
      });
      this.urlBase = this.testService.url;
  }

  ngOnInit() {
  }

  getResult() {
    this.requestingResult = true;
    this.testService.getResult(this.id).subscribe(
      response => {
        this.requestingResult = false;
        console.log("resultados: ", response.result);
        this.testResults = response.result;
      },
      error => console.error(error)
    )
  }
}
