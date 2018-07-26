import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private router: Router, private oauthService: OAuthService) {
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        // handle your auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            // navigate /delete cookies or whatever
            this.router.navigateByUrl(`/unauthorized`);
        }
        return Observable.throw(err);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = req;
        const tokenValue = 'Bearer ' + this.oauthService.getAccessToken();
        requestToForward = req.clone({ setHeaders: { 'Authorization': tokenValue} });

        return next.handle(requestToForward).catch( err => this.handleAuthError(err));
    }
}
