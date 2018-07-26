import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(
        private router: Router,
        private oauthService: OAuthService
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const claims = this.oauthService.getIdentityClaims();
        if (!claims) {
            this.router.navigate(['unauthorized']);
        }
        return true;
    }
}
