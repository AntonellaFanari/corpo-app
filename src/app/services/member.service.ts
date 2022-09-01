import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DomainResponse } from '../domain/domain-response';
import { CreditExpiration } from '../domain/member/credit-expiration';
import { Injury } from '../domain/member/injury';
import { MedicalHistory } from '../domain/member/medical-history';
import { Member } from '../domain/member/member';
import { MemberView } from '../domain/member/member-view';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  url: string;
  newMember: boolean;

  constructor(private http: HttpClient, @Inject('BASE_URL') url: string) {
    this.url = url;
  }

  // member

  public getAll() {
    return this.http.get<MemberView[]>(this.url + 'api/member/getAll');
  }
  public getById() {
    return this.http.get<DomainResponse<any>>(this.url + 'api/member/getById');
  }
  public add(newMember: Member){
    console.log("socio servicio: ", newMember);
    return this.http.post<any>(this.url + 'api/member/add', newMember, httpOptions);
  }

  public update(id: number, memberUpdate: Member) {
    console.log(memberUpdate);
    return this.http.put<DomainResponse<any>>(this.url + 'api/member/update?id=' + id, memberUpdate, httpOptions);
  }

  public delete(id: number) {
    return this.http.delete(this.url + 'api/member/delete?id=' + id);
  }

  public updateDueDate(expiration: CreditExpiration) {
    return this.http.put(this.url + 'api/member/updateDueDate', expiration, httpOptions);
  }

  //medicalHistory
  public addMedicalHistory(medicalHistory: MedicalHistory) {
    console.log(medicalHistory);
    return this.http.post<any>(this.url + 'api/member/addMedicalHistory', medicalHistory, httpOptions);
  }

  public updateMedicalHistory(id: number, medicalHistory: MedicalHistory) {
    return this.http.put<any>(this.url + 'api/member/updateMedicalHistory?id=' + id, medicalHistory, httpOptions);
  }

  public getMedicalHistoryByIdMember() {
    return this.http.get<any>(this.url + 'api/member/getMedicalHistoryByIdMember');
  }

  public getMedicalHistoryById(id: number) {
    return this.http.get<any>(this.url + 'api/member/getMedicalHistoryById?id=' + id);
  }

  public getAge() {
    return this.http.get<DomainResponse<any>>(this.url + 'api/member/getAge');
  }

  public getExistsMedicalHistory(id: number){
    return this.http.get<DomainResponse<any>>(this.url + 'api/member/exists-medical-history?id=' + id);
  }

  //injury

  public addInjury(injury: Injury) {
    return this.http.post<any>(this.url + 'api/member/addInjury', injury, httpOptions);
  }

  public addFile(id: number, files: File[]) {
    console.log(files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
      console.log(formData);
    })
    return this.http.post<any>(this.url + `api/member/${id}/addFile`, formData);
  }

  public getAllInjuries(id: number) {
    return this.http.get<Injury[]>(this.url + 'api/member/getAllInjuries?id=' + id);
  }

  public getAllFiles(id: number) {
    return this.http.get<any>(this.url + 'api/member/getAllFiles?id=' + id);
  }

  public deleteFile(id: number) {
    return this.http.delete(this.url + 'api/member/deleteFile?id=' + id);
  }

  public download(fileName: string) {
    return this.http.get(this.url + 'api/member/download?fileName=' + fileName, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  public getLevel() {
    return this.http.get<DomainResponse<any>>(this.url + 'api/member/level');
  }
}
