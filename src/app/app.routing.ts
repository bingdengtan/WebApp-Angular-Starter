import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from './services/authorization.guard';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { StarterComponent } from './pages/starter/starter.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { RoleComponent } from './pages/role/role.component';
import { UserComponent } from './pages/user/user.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'starter', pathMatch: 'full' },
      { path: 'starter', component: StarterComponent},
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: 'forbidden', component: ForbiddenComponent },
      { path: 'dashboard', component: DashboardComponent,
        children: [
          { path: 'home', component: HomeComponent},
          { path: 'adm/roles', component: RoleComponent},
          { path: 'adm/users', component: UserComponent}
        ]
      }
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})

export class AppRoutingModule {}
