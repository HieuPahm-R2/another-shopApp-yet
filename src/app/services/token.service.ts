import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TokenService{
    localStorage?: Storage
    private readonly TOKEN_KEY = 'access_token'

    getToken(): string{
        return this?.localStorage?.getItem(this.TOKEN_KEY) ?? ''
    }
    setToken(token: string): void{
        this.localStorage?.setItem(this.TOKEN_KEY,token)
    }
      removeToken(): void {
    this.localStorage?.removeItem(this.TOKEN_KEY)
  }

//   isTokenExpired(): boolean {
//     if (this.getToken() == null) {
//       return false
//     }
//     return this.jwtHelperService.isTokenExpired(this.getToken()!)
//   }
}