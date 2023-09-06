import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../register/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedOut: boolean = true;
  schoolLoggedIn: boolean = false;

  providerId = JSON.parse(localStorage.getItem('user')!);
  obj = Object;
  constructor(private auth: AuthService) {}
  @ViewChild('navCollapsable') nav: ElementRef;

  ngOnInit(): void {
    this.isLoggedOut = !this.auth.isLoggedIn();
    this.auth.loggedInUser.subscribe((user) => {
      if (user) {
        this.isLoggedOut = false;
      } else {
        this.isLoggedOut = true;
      }
      if (
        user.providerData[0].providerId === 'facebook.com' ||
        user.providerData[0].providerId === 'google.com'
      ) {
        this.schoolLoggedIn = false;
      } else {
        this.schoolLoggedIn = true;
      }
    });
  }
  ngOnDestroy(): void {
    this.auth.loggedInSub.unsubscribe();
    this.auth.loggedInUser.unsubscribe();
  }

  logout() {
    this.auth.logout();
    this.isLoggedOut = true;
  }
  toggleNav() {
    this.nav.nativeElement.classList.toggle('collapse');
  }
}
