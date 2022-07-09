import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BalanceToPay } from '../domain/finance/balance-to-pay';
import { PayCancelBalance } from '../domain/finance/pay-cancel-balance';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}


@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public add(balance: BalanceToPay) {
    console.log(balance);
    return this.http.post<any>(this.url + 'api/balance/add', balance, httpOptions);
  }

  public getAll() {
    return this.http.get<any>(this.url + 'api/balance/getAll');
  }

  public getAllByIdMember(id: number) {
    return this.http.get<any>(this.url + 'api/balance/getAllByIdMember?id=' + id);
  }

  public getById(id: number) {
    return this.http.get<any>(this.url + 'api/balance/getById?id=' + id);
  }

  public getPositiveBalanceByIdMember(id: number) {
    return this.http.get<any>(this.url + 'api/balance/getPositiveBalanceByIdMember?id=' + id);
  }

  public update(id: number, balance: BalanceToPay) {
    return this.http.put(this.url + 'api/balance/update?id=' + id, balance, httpOptions);
  }

  public cancelBalance(payCancelBalance: PayCancelBalance) {
    return this.http.put<any>(this.url + 'api/balance/cancelBalance', payCancelBalance, httpOptions);
  }


}
