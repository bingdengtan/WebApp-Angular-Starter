import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventEmitter } from 'events';

import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './utils/auth.config';

import { CoreService } from './services/core.service';

import { AuthService } from './services/auth.service';
import { EventsService } from './services/events.service';
import { Output } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
    isAuthorized = false;
    userData: any;

    constructor(
        private authService: AuthService,
        private eventsService: EventsService,
        private titleService: Title,
        private coreService: CoreService,
        private oauthService: OAuthService
    ) {
        this.configureWithNewConfigApi();
    }

    ngOnInit() {

    }

    private configureWithNewConfigApi() {
        this.oauthService.configure(authConfig);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }
}
