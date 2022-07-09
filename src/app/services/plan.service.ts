import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Plan } from '../domain/member/plan';


const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public getAll() {
    return this.http.get<any>(this.url + 'api/plan/getPlans');
  }

  public add(newPlan: Plan) {
    console.log(newPlan);
    return this.http.post<any>(this.url + 'api/plan/add', newPlan, httpOptions);
  }

  public getById(id: number) {
    return this.http.get<Plan>(this.url + 'api/plan/getById?id=' + id);
  }

  public update(id: number, planEdit: Plan) {
    console.log(planEdit);
    return this.http.put(this.url + 'api/plan/update?id=' + id, planEdit, httpOptions);
  }

  public delete(id: number) {
    return this.http.delete(this.url + 'api/plan/delete?id=' + id);
  }
}
