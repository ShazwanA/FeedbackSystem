import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserLoginComponent } from '../user-login/user-login.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicesService } from './services.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(
    private route: Router,
    private dialogs: MatDialog,
    private services: ServicesService,
    )
  {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
      // if (localStorage.getItem('user')!=null){
      //   this.openLoginPopups();
      //   return false;
      // }

      // else{
      //   this.route.navigate(['dashboard-admin'])
      //   return true;
      // }
      // if(localStorage.getItem('username') && localStorage.getItem('usertype'))
      //   return true;

      // return this.services.isLoggedIn;

      let url: string = state.url;
      return this.checkUserLogin(route, url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.services.isSignedIn()) {
      const userRole = this.services.getRole();
      if (route.data['usertype'] && route.data['usertype'].indexOf(userRole) === -1) {
        this.route.navigate(['']);
        return false;
      }
      return true;
    }

    this.route.navigate(['']);
    this.openLoginPopups();
    return false;
  }

  openLoginPopups(){
    this.dialogs.open(UserLoginComponent, {
      width: '40%',
      height: '70%',
    });
  }

}
