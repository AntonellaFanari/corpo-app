import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Anamnesis } from '../domain/anamnesis/anamnesis';
import { DomainResponse } from '../domain/domain-response';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AnamnesisService {
  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public add(anamnesis: Anamnesis){
    console.log("llego anamnesis al servicio: ", anamnesis);
    return this.http.post<DomainResponse<any>>(this.url + 'api/anamnesis', anamnesis, httpOptions);
  }

  public getByMemberId(){
    return this.http.get<DomainResponse<Anamnesis>>(this.url + 'api/anamnesis');
  }
}
