import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Attendance } from '../domain/attendance';
import { DomainResponse } from '../domain/domain-response';
import { Credit } from '../domain/member/credit';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public getAllByIdShift(id: number) {
    return this.http.get<any>(this.url + 'api/attendance/getAllByIdShift?id=' + id);
  }

  // public getByMonth(month: number) {
  //   return this.http.get<any>(this.url + 'api/attendance/get-by-id-member-by-month?month=' + month);
  // }

  public getByMonth(month: number) {
    return this.http.get<any>(this.url + 'api/attendance/all-by-month?month=' + month);
  }

  public add(attendance: Attendance) {
    return this.http.post<DomainResponse<any>>(this.url + 'api/attendance/add', attendance, httpOptions);
  }

  public cancelReservation(id: number, credit: Credit) {
    return this.http.put(this.url + 'api/attendance/cancelReservation?id=' + id, credit, httpOptions);
  }

  public getAllReservations() {
    return this.http.get<any>(this.url + 'api/attendance/getAllReservations');
  }

  public getByPeriodization(id: number) {
    return this.http.get<any>(this.url + 'api/wod-member/attendance?id=' + id);
  }  

  public getAllSettings() {
    return this.http.get<DomainResponse<Array<any>>>(this.url + 'api/settings');
  }

  public getByFromByToByClass(from: string, to: string, classId: number){
    return this.http.get<DomainResponse<any>>(this.url + 'api/attendance/by-from-by-to-by-class?from='+ from + '&to='+ to + '&classId=' + classId);
  }

}
