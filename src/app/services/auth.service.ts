import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable() export class AuthService {

    private hasStorage: boolean;

    constructor(
        private http: HttpClient
    ) {
        this.hasStorage = typeof Storage !== 'undefined';
        // this.authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);
    }

    /**
     * Stores the URL so we can redirect after signing in.
     */
    public getRedirectUrl(): string {
        if (this.hasStorage) {
            return sessionStorage.getItem('redirectUrl');
        }
        return null;
    }

    public setRedirectUrl(url: string): void {
        if (this.hasStorage) {
            sessionStorage.setItem('redirectUrl', url);
        }
    }

    public removeRedirectUrl(): void {
        sessionStorage.removeItem('redirectUrl');
    }

    public getAuthorizationHeader(): HttpHeaders {
        // Creates header for the auth requests.
        let headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');

        const token = '';
        if (token !== '') {
            const tokenValue: string = 'Bearer ' + token;
            headers = headers.append('Authorization', tokenValue);
        }
        return headers;
    }

    public revokeToken(): void {

    }

    private encodeParams(params: any): string {
        let body = '';
        for (const key of Object.keys(params)) {
            if (body.length) {
                body += '&';
            }
            body += key + '=';
            body += encodeURIComponent(params[key]);
        }
        return body;
    }
}
