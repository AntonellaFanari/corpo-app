import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DomainResponse } from '../domain/domain-response';
import { ResultsWodGroupMember } from '../domain/workout/results-wod-group-member';
import { wodTemplateResponse } from '../domain/workout/wod';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class WodService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public getAll() {
    return this.http.get(this.url + 'api/wod-member');
  }
  public getById(id: number) {
    return this.http.get<wodTemplateResponse>(this.url + 'api/wod-member/by-Id?id=' + id);
  } 

  public updateRate(id: number, rate: number){
    return this.http.put<DomainResponse<any>>(this.url + 'api/wod-member/rate?id='+id + '&rate='+ rate, httpOptions);
  }

  public getByPeriodizationId(id: number, weekNumber: number) {
    return this.http.get<any>(this.url + 'api/wod-member/by-week?id=' + id + '&weekNumber=' + weekNumber);
  }

  public getAttendancesByYear() {
    return this.http.get<DomainResponse<any>>(this.url + 'api/wod-member/attendance-by-year');
  }

  public getAttended(periodizationId: number) {
    return this.http.get<DomainResponse<any>>(this.url + 'api/wod-member/attended/' + periodizationId);
  }

  public updateRest(id: number, rest: number){
    return this.http.put<DomainResponse<any>>(this.url + 'api/wod-member/rest?id='+id + '&rest='+ rest, httpOptions);
  }


}
