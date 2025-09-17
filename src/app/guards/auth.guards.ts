
import { TokenService } from "../services/token.service";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private tokenService: TokenService, private router: Router) { }

    canActive(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isTokenExpired = this.tokenService.isTokenExpired()
        const isUserValid = this.tokenService.getUserId() > 0
        if (!isTokenExpired && isUserValid) {
            return true
        } else {
            this.router.navigate(['/login'])
            return false
        }

    }
}
// Sử dụng functional guard như sau:
export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    // debugger
    return inject(AuthGuard).canActive(next, state)
}