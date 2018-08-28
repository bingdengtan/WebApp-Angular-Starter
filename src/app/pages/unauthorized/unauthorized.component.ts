import { Component, OnInit, OnDestroy } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Title } from '@angular/platform-browser';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(private titleService: Title, private oauthService: OAuthService) {

  }

  ngOnInit() {
    this.titleService.setTitle('401 - NOT AUTHORIZED');
  }

  login() {
    if (!this.oauthService.getAccessToken()) {
      this.oauthService.logOut();
    }
    this.oauthService.initImplicitFlow();
  }
}
