import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './register/auth-service.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot) {
    const loginProvider = JSON.parse(localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user')!).providerData[0].providerId
      : undefined;
    const url = next.url[0].path;
    const urlArr = next.url;
    if (url === 'login') {
      if (!this.authService.isLoggedIn()) {
        return true; // Allow access to the login page if the user is not logged in.
      } else {
        this.router.navigate(['/']);
        return false; // Redirect to the home page if the user is already logged in.
      }
    } else if (urlArr[0].path === 'school' && urlArr[1].path === 'mySchool') {
      if (!loginProvider) {
        return true;
      }
      if (loginProvider === 'facebook.com' || loginProvider === 'google.com') {
        return false;
      } else {
        return true;
      }
    } else {
      return true; // Allow access to other routes.
    }
  }
}
