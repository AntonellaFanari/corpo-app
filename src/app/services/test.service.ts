import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DomainResponse } from '../domain/domain-response';
import { TestHeartRateExercise } from '../domain/test/test-heart-rate-exercise';
import { TestRepetitionExercise } from '../domain/test/test-repetition-exercise';
import { TestResult } from '../domain/test/test-result';
import { TestVideoExercise } from '../domain/test/test-video-exercise';
import { TestExerciseMember } from '../domain/test/test-exercise-member';
import { TestMember } from '../domain/test/test-member';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TestService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public getTestPending(){
    return this.http.get<DomainResponse<TestMember>>(this.url + 'api/test-member/pending-by-member-logged');
  }

  public getById(id: number) {
    return this.http.get<DomainResponse<TestMember>>(this.url + 'api/test-member/' + id);
  }

  public getAll(){
    return this.http.get<DomainResponse<Array<TestMember>>>(this.url + 'api/test-member/all-by-member-logged');
  }

  public getExerciseById(id: number){
    return this.http.get<DomainResponse<TestExerciseMember>>(this.url + 'api/test-member/exercise-by-id?id='+ id);
  }

  public addResultTestHeartRateExercise(result: TestHeartRateExercise){
    return this.http.post<DomainResponse<any>>(this.url + 'api/test-member/result-test-heart-rate-exercise', result, httpOptions)
  }

  public addResultTestRepetitionExercise(result: TestRepetitionExercise){
    return this.http.post<DomainResponse<any>>(this.url + 'api/test-member/result-test-repetition-exercise', result, httpOptions)
  }

  public addResultTestVideoExercise(result: TestVideoExercise) {
    console.log(result);
    const formData = new FormData();
    formData.append('files', result.fileVideo);
    formData.append('files', result.fileImg);
    formData.append('rate', result.rate.toString());
    formData.append('exerciseId', result.testExerciseMemberId.toString());
    formData.append('testId', result.testMemberId.toString());
    console.log(formData);
    return this.http.post(this.url + 'api/test-member/result-test-video-exercise', formData);

  }

  public getResult(id: number){
    return this.http.get<DomainResponse<Array<TestResult>>>(this.url + 'api/test-member/result?id='+ id);
  }

  public getExerciseFms(id: number){
    return this.http.get<DomainResponse<any>>(this.url + 'api/test-member/exercise-fms?id='+ id);
  }

  getExistsTestPending(){
    return this.http.get<DomainResponse<any>>(this.url + 'api/test-member/exists-test-pending')
  }

}
