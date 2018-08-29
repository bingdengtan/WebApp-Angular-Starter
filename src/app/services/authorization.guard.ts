import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { MenuService } from '../services/menu.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(
        private router: Router,
        private oauthService: OAuthService,
        private menuService: MenuService
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const claims = this.oauthService.getIdentityClaims();
        if (!claims) {
            this.router.navigate(['unauthorized']);
        } else if (!this.menuService.hasPermission(state.url)) {
            return false;
        }
        return true;
    }
}
