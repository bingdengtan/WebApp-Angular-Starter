import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-app-left-side',
  templateUrl: './app-left-side.component.html',
  styleUrls: ['./app-left-side.component.scss']
})
export class AppLeftSideComponent implements OnInit {
  menus: Array<any> = new Array();
  loading: boolean;

  constructor(private coreService: CoreService,
    private oauthService: OAuthService,
    private userService: UserService) { }

  ngOnInit() {
    this.showLayout();
  }

  showLayout(): void {
    if (this.oauthService.getAccessToken()) {
      this.userService.getMe().then( user => {
        const me = user;
        const roles = me.roles.map(x => x.role_name);

        this.coreService.getLayoutConfig().then(response => {
          const menus = response;
          menus.forEach(menu => {
            const items = menu.items.filter(item => {
              if (item.canActivateByRoles.indexOf('*') > -1) {
                return true;
              } else {
                let hasPermission = false;
                item.canActivateByRoles.forEach(role => {
                  if (roles.indexOf(role) > -1) {
                    hasPermission = true;
                  }
                });
                return hasPermission;
              }
            });

            if (items.length > 0) {
              this.menus.push({header: menu.header, items: items});
            }
            this.loading = false;
          });
        }).catch( e => {
          this.loading = false;
          console.log(e);
        });
      });
    }
  }
}
