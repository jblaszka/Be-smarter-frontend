import { NgModule, inject } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Route[] = [
  {
    path:'',
    loadComponent:() => import('./pages/login/login.component').then((mod) => mod.LoginComponent)
  },
  {
    path:'dashboard',
    loadComponent:() => import('./pages/dashboard/dashboard.component').then((mod) => mod.DashboardComponent),
    canActivate: [() => inject(AuthService).isLoggedIn()]
  },
  {
    path:'registration',
    loadComponent:() => import('./pages/register/register.component').then((mod) => mod.RegisterComponent)
  },
  {
    path:'account',
    loadComponent:() => import('./pages/account/account.component').then((mod) => mod.AccountComponent),
    canActivate: [() => inject(AuthService).isLoggedIn()]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
