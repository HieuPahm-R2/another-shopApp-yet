import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../env/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`
  private apiLogin = `${environment.apiBaseUrl}/users/login`
  private apiConfig = { headers: this.createHeaders() }
  private createHeaders(): HttpHeaders{
    return new HttpHeaders({
        'Content-type': 'application/json',
      });
  }

  constructor(private http: HttpClient) {}
  register(registerData: any):Observable<any>{
      return this.http.post(this.apiRegister, registerData, this.apiConfig)
    }
  login(loginData: any):Observable<any>{
      return this.http.post(this.apiLogin, loginData, this.apiConfig)
    }
}
