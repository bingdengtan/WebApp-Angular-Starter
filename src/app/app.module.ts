import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxBootstrapModule } from './utils/ngxBootstrap.module';

import { OAuthModule } from 'angular-oauth2-oidc';

import { AppRoutingModule } from './app.routing';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppLeftSideComponent } from './components/app-left-side/app-left-side.component';
import { AppControlSidebarComponent } from './components/app-control-sidebar/app-control-sidebar.component';
import { HomeComponent } from './pages/home/home.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { StarterComponent } from './pages/starter/starter.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { RoleComponent } from './pages/role/role.component';
import { UserComponent } from './pages/user/user.component';
import { GridComponent } from './components/grid/grid.component';

import { AuthService } from './services/auth.service';
import { MenuService } from './services/menu.service';
import { BasicModelService } from './services/basic.model.service';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { EventsService } from './services/events.service';
import { CoreService } from './services/core.service';
import { CoreUtils } from './utils/core.utils';
import { AuthorizationGuard } from './services/authorization.guard';
import { AuthInterceptor } from './services/authInterceptor.service';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AppHeaderComponent,
    AppFooterComponent,
    AppLeftSideComponent,
    AppControlSidebarComponent,
    HomeComponent,
    UnauthorizedComponent,
    StarterComponent,
    ForbiddenComponent,
    RoleComponent,
    UserComponent,
    GridComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxBootstrapModule,
    OAuthModule.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthService,
    CoreService,
    RoleService,
    AuthorizationGuard,
    UserService,
    MenuService,
    CoreUtils,
    EventsService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
