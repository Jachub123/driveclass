import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../register/auth-service.service';
import { School } from '../search-drive-class/driving-school/school.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedOut: boolean = true;
  obj = Object;
  constructor(private auth: AuthService) {}
  @ViewChild('navCollapsable') nav: ElementRef;

  ngOnInit(): void {
    this.auth.loggedIn();
    this.auth.loggedInUser.subscribe((user) => {
      this.isLoggedOut = user.isAnonymous;
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
