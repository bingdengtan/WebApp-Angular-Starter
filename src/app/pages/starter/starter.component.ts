import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements OnInit {
  isAuthorized = false;

  constructor(private router: Router, private oauthService: OAuthService) {
  }

  ngOnInit() {
    if (!this.oauthService.getAccessToken()) {
      this.oauthService.initImplicitFlow();
    } else {
      this.router.navigate(['dashboard/home']);
    }
  }
}
