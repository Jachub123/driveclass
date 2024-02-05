import { Component, OnDestroy, OnInit } from '@angular/core';
import { SchoolService } from '../school.service';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'app-premium-sub',
  templateUrl: './premium-sub.component.html',
  styleUrls: ['./premium-sub.component.scss'],
})
export class PremiumSubComponent implements OnInit, OnDestroy {
  text: Array<String> = [
    'Driveclass Premium Abos',
    'Premium Abo Fahrschule Monatlich',
    'übersichtliches Profil',
    'SEO optimierte Inhalte',
    'laufende Updates',
    'aktive promotion auf Social Media',
  ];
  langSub: Subscription;
  constructor(private schoolService: SchoolService) {}
  langChangeSub: Subscription;

  ngOnInit(): void {
    this.langChangeSub = this.schoolService.language.subscribe((lang) => {
      for (let i = 0; i < this.text.length; i++) {
        this.schoolService
          .getTranslation(this.text[i], localStorage.getItem('lang'), lang)
          .subscribe((result) => {
            this.text[i] = result.translations[0].text;
          });
      }
    });

    if (localStorage.getItem('lang') !== 'DE') {
      for (let i = 0; i < this.text.length; i++) {
        this.langSub = this.schoolService
          .getTranslation(this.text[i], 'DE', localStorage.getItem('lang'))
          .pipe(first())
          .subscribe((result) => {
            this.text[i] = result.translations[0].text;
          });
      }
    }
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
    this.langChangeSub?.unsubscribe();
  }
}
