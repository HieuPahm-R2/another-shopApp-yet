import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../env/environments';
import { UserResponse } from '../res/user.response';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  localStorage?: Storage
  private apiRegister = `${environment.apiBaseUrl}/users/register`
  private apiLogin = `${environment.apiBaseUrl}/users/login`
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`
  private apiConfig = { headers: this.createHeaders() }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-type': 'application/json',
    });
  }

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage
  }
  register(registerData: any): Observable<any> {
    return this.http.post(this.apiRegister, registerData, this.apiConfig)
  }
  login(loginData: any): Observable<any> {
    return this.http.post(this.apiLogin, loginData, this.apiConfig)
  }
  getUserDetail(token: string) {
    return this.http.post(this.apiUserDetail, {
      headers: new Headers({
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  saveUserResponseToLs(userResponse?: UserResponse) {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse)
      this.localStorage?.setItem('user', userResponseJSON)
    } catch (error) {
      console.error('Error saving user response to local storage:', error)
    }
  }
  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      // Retrieve JSON string
      const userResponseJSON = this.localStorage?.getItem('user')
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null
      }
      const userResponse = JSON.parse(userResponseJSON!)
      return userResponse
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error)
      return null // Return null or handle the error as needed
    }
  }
}
