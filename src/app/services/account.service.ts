import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DomainResponse } from '../domain/domain-response';
import { Account } from '../domain/user/account';
import { LoggedUser } from '../domain/user/logged-user';
import { AccountNewPassword } from '../domain/user/new-password';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  url: string;
  logueado: boolean = false;
  token: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  add(newAccount: Account): Promise<any> {
    console.log(newAccount);
    return this.http.post<number>(this.url + 'api/account/add', newAccount, httpOptions).toPromise();
  }

  logIn(account: Account){
    return this.http.post<any>(this.url + 'api/account/logIn?account', account);
  }

  updateEmail(account: Account) {
    console.log(account);
    return this.http.put(this.url + 'api/account/updateEmail', account, httpOptions);
  }

  updatePassword(account: AccountNewPassword) {
    console.log(account);
    return this.http.put(this.url + 'api/account/updatePassword', account, httpOptions);
  }

recoverPassword(email: string){
  return this.http.get<DomainResponse<any>>(this.url + 'api/account/recover-password?email='+ email, httpOptions);
}

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    console.log("isAuthenticated", localStorage.getItem('logueado'))
    return "true" == localStorage.getItem('logueado');
  }

  setAuthenticated(authenticated: boolean) {
    localStorage.setItem('logueado', authenticated.toString());
  }

  getLoggedUser() {   
    return JSON.parse(localStorage.getItem('user')) as LoggedUser;
  }

  setLoggedUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.setAccess(user.access)
  }

  getAccess() {
    return JSON.parse(localStorage.getItem('access'));
  }

  setAccess(access: string[]) {
    localStorage.setItem('access', JSON.stringify(access));
  }
}
