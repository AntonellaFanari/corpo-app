import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DomainResponse } from '../domain/domain-response';
import { Periodization, PeriodizationWeek } from '../domain/workout/periodization';


const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class PeriodizationService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public get() {
    return this.http.get<any>(this.url + 'api/periodization');
  }

  public getByYear() {
     return this.http.get<any>(this.url + 'api/periodization/by-year');
   }

   public getByPeriodizationWeek(periodizationWeekId: number) {
    return this.http.get<DomainResponse<PeriodizationWeek>>(this.url + 'api/periodization/by-periodization-week?id=' + periodizationWeekId);
  }

  public getById(id: number) {
    return this.http.get<DomainResponse<Periodization>>(this.url + 'api/periodization/' + id);
  }
}
