import { Injectable } from '@angular/core';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { UserService } from '../services/user.service';
import { CoreService } from '../services/core.service';

@Injectable()
export class MenuService {
    menus: Array<any> = new Array();
    userRoles: Array<any> = new Array();
    layouts: Array<any> = new Array();
    lsMenuKey = 'ls_key_menu';

    constructor(private oauthService: OAuthService,
        private coreService: CoreService,
        private userService: UserService) {
            const strMenus = localStorage.getItem(this.lsMenuKey);
            if (strMenus && strMenus !== '') {
                this.menus = JSON.parse(strMenus);
            }
        }

    async resetMenus(): Promise<any> {
        this.menus = [];
        this.layouts = await this.coreService.getLayoutConfig();

        if (this.oauthService.getAccessToken()) {
            const me = await this.userService.getMe();
            this.userRoles = me.roles.map(x => x.role_name);
        }

        return new Promise((resolve, reject) => {
            this.menus = this.getMenus();
            localStorage.setItem(this.lsMenuKey, JSON.stringify(this.menus));
            resolve(this.menus);
        });
    }

    hasPermission(url: string): boolean {
        let canActivateUrls = [];
        this.menus.forEach( menu => {
            const items = menu.items.map(x => x.path);
            canActivateUrls = canActivateUrls.concat(items);
        });
        return canActivateUrls.indexOf(url.substring(1)) > -1;
    }

    private getMenus(): any {
        const _menus = [];
        this.layouts.forEach(menu => {
            const items = menu.items.filter(item => {
                if (item.canActivateByRoles.indexOf('*') > -1) {
                  return true;
                } else {
                  let hasPermission = false;
                  item.canActivateByRoles.forEach(role => {
                    if (this.userRoles.indexOf(role) > -1) {
                      hasPermission = true;
                    }
                  });
                  return hasPermission;
                }
              });

            if (items.length > 0) {
                _menus.push({header: menu.header, items: items});
            }
        });
        return _menus;
    }
}
