import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { UserService } from '../../services/user.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-app-left-side',
  templateUrl: './app-left-side.component.html',
  styleUrls: ['./app-left-side.component.scss']
})
export class AppLeftSideComponent implements OnInit, AfterViewInit, AfterContentInit {
  menus: Array<any> = new Array();
  loading: boolean;

  constructor(private coreService: CoreService,
    private oauthService: OAuthService,
    private menuService: MenuService,
    private userService: UserService) { }

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit() {
    this.menus = this.menuService.menus;
  }

  ngAfterContentInit() {
    if (this.loading) {
      this.menuService.resetMenus().then(menus => {
        this.menus = menus;
        this.loading = false;
      });
    }
  }
}
