import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { CoreService } from '../../services/core.service';

import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  username = '';
  email = '';
  location = '';
  title = '';

  constructor(private authService: AuthService,
    private eventsService: EventsService,
    private coreService: CoreService,
    private oauthService: OAuthService
  ) {
      this.coreService.getAppConfig('header_title').then( title => {
        this.title = title;
      });
    }

  ngOnInit() {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.username = claims['sub'];
    }
    this.oauthService.events.subscribe(e => {
      if (e.type === 'token_received') {
        if (claims) {
          this.username = claims['sub'];
        }
      }
    });
  }

  logout(): void {
    this.oauthService.logOut();
  }
}
