import { Role } from '../domain/user/role';
import { UserView } from '../domain/user/user-view';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import {
  User
} from '../domain/user/user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  public getRoles() {
    return this.http.get<Role[]>(this.url + 'api/user/getRoles');
  }

  public getAll() {
    return this.http.get<UserView[]>(this.url + 'api/user/getAll');
  }

  public getById(id: number) {
    return this.http.get<UserView>(this.url + 'api/user/getById?id=' + id);
  }

  public getAllByNameRole(role: string) {
    return this.http.get<any>(this.url + 'api/user/getAllByNameRole?role=' + role);
  }

  public add(newUser: User): Promise<void> {
    return this.http.post<void>(this.url + 'api/user/add', newUser, httpOptions).toPromise();
  }

  public update(id: number, userUpdate: User) {
    console.log(userUpdate);
    return this.http.put(this.url + 'api/user/update?id=' + id, userUpdate, httpOptions);
  }

  public delete(id: number, email: string) {
    console.log(id);
    return this.http.delete(this.url + 'api/user/delete?id=' + id + '&&email=' + email);
  }
}
