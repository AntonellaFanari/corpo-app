import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DomainResponse } from '../domain/domain-response';
import { ResultsWodGroupMember } from '../domain/workout/results-wod-group-member';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ResultsWodGroupMemberService {
url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL')url: string) {
    this.url = url;
   }

   public add(results: ResultsWodGroupMember[]){
    console.log(results);
    return this.http.post<DomainResponse<any>>(this.url + 'api/results-wod-group-member', results, httpOptions);
  }

  public getByWodId(id: number){
    return this.http.get<DomainResponse<any>>(this.url + 'api/results-wod-group-member/by-wod-id?wodId='+ id);
  }
}
