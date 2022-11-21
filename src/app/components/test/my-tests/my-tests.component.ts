import { Component, OnInit } from '@angular/core';
import { StatusTest, TestMember } from 'src/app/domain/test/test-member';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-my-tests',
  templateUrl: './my-tests.component.html',
  styleUrls: ['./my-tests.component.scss'],
})
export class MyTestsComponent implements OnInit {
  id: number;
  memberId: number;
  tests: TestMember[] = [];
  displayTests: boolean;
  toTest: boolean = true;
  requestingTest: boolean;
  requestingTestList: boolean;


  
  constructor(private testService: TestService) { }

  ngOnInit() {
    this.getTest();
  }

  
  ionViewWillEnter(){
    this.getTest();
  }

  getTestHistory(){
    this.displayTests = true;
    this.requestingTestList = true;
    this.testService.getAll().subscribe(
      response => {
        this.requestingTestList = false;
        console.log("mis test: ", response);
        this.tests = response.result;
        
      }, 
      error => console.error(error)
    )
  }

  
  getTest(){
    this.requestingTest = true;
    this.testService.getTestPending().subscribe(
      response => {
        this.requestingTest = false;
        console.log("test pendiente: ", response.result);
        if(response.result == null) {
          this.toTest = false;
        }
        else{
          this.toTest = true;
          this.id = response.result.id;
        }
      },
      error => console.error(error)
    )
  }

  hideTests(){
    this.displayTests = false;
    this.getTest();
  }


  
}
