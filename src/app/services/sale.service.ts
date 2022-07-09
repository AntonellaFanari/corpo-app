import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Sale } from '../domain/finance/sale';
import { SaleDetail } from '../domain/finance/sale-detail';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}


@Injectable({
  providedIn: 'root'
})
export class SaleService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public getAll() {
    return this.http.get<Sale[]>(this.url + 'api/sale/getAll');
  }

  public getSaleDetail(idSale) {
    return this.http.get<SaleDetail[]>(this.url + 'api/sale/getDetailsSale?idSale=' + idSale);
  }

  public add(newSale) {
    return this.http.post<any>(this.url + 'api/sale/add', newSale, httpOptions);
  }

  public cancel(id, cancelSale) {
    console.log(cancelSale);
    return this.http.post(this.url + 'api/sale/cancel?id=' + id, cancelSale, httpOptions);
  }

  public getCancelSale(idSale) {
    return this.http.get<any>(this.url + 'api/sale/getCancelSale?idSale=' + idSale);
  }

  public getSaleById(id: number) {
    return this.http.get<any>(this.url + 'api/sale/getSaleById?id=' + id);
  }
}
