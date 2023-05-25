import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly URL = environment.urlBase
  constructor(private http: HttpClient) { }



  sendCredentials(formData: any): Observable<any> {
    return this.http.post(`${this.URL}auth/login`, formData)
  }


  registerCLient(formData: any): Observable<any> {
    return this.http.post(`${this.URL}register`, formData)
  }


  
}
