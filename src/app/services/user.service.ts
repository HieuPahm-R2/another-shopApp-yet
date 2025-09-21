import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../env/environments';
import { UserResponse } from '../res/user.response';
import { DOCUMENT } from '@angular/common';
import { HttpUtilService } from './http.util.service';
import { UpdateUserDTO } from '../dtos/user.update.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  localStorage?: Storage
  private apiRegister = `${environment.apiBaseUrl}/users/register`
  private apiLogin = `${environment.apiBaseUrl}/users/login`
  private apiUserDetail = `${environment.apiBaseUrl}/users/details`
  private apiConfig = { headers: this.httpUtilService.createHeaders() }

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService,
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
  getUserDetail(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    // http.post với body là một object rỗng và options chứa headers
    return this.http.post(this.apiUserDetail, {}, { headers: headers });
  }
  updateUser(token: string, updateUserDTO: UpdateUserDTO) {
    let userRes = this.getUserResponseFromLocalStorage()
    return this.http.put(`${this.apiUserDetail}/${userRes?.id}`, updateUserDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
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
  removeUserFromLocalStorage(): void {
    try {
      // Remove the user data from local storage using the key
      this.localStorage?.removeItem('user')
      console.log('User data removed from local storage.')
    } catch (error) {
      console.error('Error removing user data from local storage:', error)
    }
  }
}
