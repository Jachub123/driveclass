import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Input,
} from '@angular/core';
import { AuthService } from '../register/auth-service.service';
import { SchoolService } from '../school.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoggedOut: boolean = true;
  schoolLoggedIn: boolean = false;
  providerId = JSON.parse(localStorage.getItem('user')!);
  @ViewChild('navCollapsable') nav: ElementRef;
  @ViewChild('langSelect') langSelect: ElementRef;
  text: Array<String> = [
    'LINKS UND TIPPS',
    'REGISTRIEREN',
    'PREMIUM ABO',
    'MEINE SCHULE',
  ];
  obj = Object;
  langChangeSub: Subscription;
  @Input() test: String;
  constructor(private auth: AuthService, private schoolService: SchoolService) {
    localStorage.setItem('lang', 'DE');
  }

  ngOnInit(): void {
    this.isLoggedOut = !this.auth.isLoggedIn();
    this.auth.loggedInUser.subscribe((user) => {
      if (user) {
        this.isLoggedOut = false;
      } else {
        this.isLoggedOut = true;
      }
      if (
        user?.providerData[0]?.providerId === 'facebook.com' ||
        user?.providerData[0]?.providerId === 'google.com'
      ) {
        this.schoolLoggedIn = false;
      } else {
        this.schoolLoggedIn = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.schoolService.languageSelected = this.langSelect.nativeElement.value;
  }

  ngOnDestroy(): void {
    this.auth.loggedInSub.unsubscribe();
    this.auth.loggedInUser.unsubscribe();
    this.langChangeSub?.unsubscribe();
  }

  logout() {
    this.auth.logout();
    this.isLoggedOut = true;
  }

  langChange(e) {
    this.langChangeSub = this.schoolService.language.subscribe((lang) => {
      for (let i = 0; i < this.text.length; i++) {
        this.schoolService
          .getTranslation(this.text[i], localStorage.getItem('lang'), lang)
          .subscribe((result) => {
            this.text[i] = result.translations[0].text;
            localStorage.setItem('lang', e.target.value);
          });
      }
    });

    this.schoolService.language.next(e.target.value);
  }

  toggleNav() {
    this.nav.nativeElement.classList.toggle('collapse');
  }
}
