import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Shift } from '../domain/shift';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})

export class ShiftService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public getAll(from: string, to: string, classId: number) {
    return this.http.get<any>(this.url + 'api/shift/getAll?from=' + from + '&to=' + to + '&classId=' + classId);
  }

  public add(shifts: Shift[]) {
    console.log(shifts);
    return this.http.post(this.url + 'api/shift/add', shifts, httpOptions);
  }

  public update(shifts: Shift[]) {
    console.log(shifts);
    return this.http.put(this.url + 'api/shift/update', shifts, httpOptions);
  }

  public delete(idShifts: number[]) {
    return this.http.post(this.url + 'api/shift/delete', idShifts, httpOptions);
  }

  public getById(id: number) {
    return this.http.get<any>(this.url + 'api/shift/getById?id=' + id);
  }
}
