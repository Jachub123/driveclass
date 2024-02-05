import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subscription, first } from 'rxjs';
import { SchoolService } from '../school.service';

@Component({
  selector: 'app-links-and-tipps',
  templateUrl: './links-and-tipps.component.html',
  styleUrls: ['./links-and-tipps.component.scss'],
  standalone: true,
  imports: [MatExpansionModule],
})
export class LinksAndTippsComponent implements OnInit, OnDestroy {
  langSub: Subscription;
  constructor(private schoolService: SchoolService) {}

  langChangeSub: Subscription;
  text: Array<String> = [
    'Tipps und Links',
    `Herzlichen Glückwunsch zum Start deiner Fahrschulerfahrung bei Driveclass!
  Der Tipps und Links-Bereich von Driveclass enthält detaillierte und leicht
  verständliche Antworten auf häufig gestellte Fragen. So kannst du Zeit
  sparen und dich auf dringendere Anfragen konzentrieren. Driveclass ist
  engagiert, dir das bestmögliche Kundenerlebnis zu bieten. Nutze den Bereich,
  um schneller deinen Führerschein zu erwerben.`,
    'Warum ist Driveclass.ch sehr praktisch und informativ?',
    `Driveclass ist eine großartige Online-Plattform, die es dir unglaublich
einfach macht, dich auf deine praktische Führerscheinprüfung
vorzubereiten. Mit nur wenigen Klicks findest du die passende Fahrschule
und kannst sofort bequem deine Fahrstunden buchen. Das bedeutet, dass du
dich nicht länger mit mühsamer Recherche und der Organisation von
Tausenden von Dingen herumschlagen musst, um deinen Führerschein zu
bekommen.`,
    `Aber das ist noch längst nicht alles - bei Driveclass arbeiten wir stetig
daran, unser Angebot zu verbessern und auszubauen. Wir sind immer offen
für Feedback und nehmen gerne deine Vorschläge entgegen, um Driveclass zu
der besten Führerschein-Plattform im Internet zu machen. Also zögere
nicht, uns zu kontaktieren und uns deine Ideen mitzuteilen - wir sind
gespannt darauf, von dir zu hören!`,
    `Haben die Fahrlehrer auf dem Portal die nötigen Zertifizierungen?`,
    `Bei Driveclass stellen wir sicher, dass alle unsere Fahrlehrer vor ihrer
Registrierung zertifiziert sind`,
    `Hab ich freie Fahrschule / Fahrlehrer Wahl?`,
    'Ja, du kannst sie völlig kostenlos auswählen und kontaktieren.',
    'Was machen wenn in meiner Umgebung kein Ergebnis vorhanden ist?',
    `Als aufstrebendes Start-up sind wir leidenschaftlich darum bemüht, die
Suchergebnisse zu verbessern. Wir laden dich herzlich ein, uns Feedback zu
geben und an unseren Bemühungen teilzunehmen. Unser engagiertes Team
arbeitet mit jugendlichem Enthusiasmus rund um die Uhr daran, unsere
Dienstleistungen in verschiedenen Regionen auszubauen und zu optimieren.
Gib uns dein wertvolles Feedback und begleite uns auf unserer spannenden
Reise, um die Suchergebnisse zu perfektionieren. Sei Teil unseres Erfolgs
und revolutioniere mit uns die Online-Suche.`,
    `Wir schätzen Deine Meinung und begrüßen daher Deine Perspektiven, wie wir
uns verbessern können. Wir möchten dich bitten, uns deine Präferenzen zur
Verbesserung von Suchergebnisse an unsere E-Mail-Adresse
info@driveclass.ch zu senden.`,
    `Vielen Dank für deine kontinuierliche Unterstützung, während wir
progressive Schritte für positive Veränderungen unternehmen`,
  ];

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

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.langChangeSub?.unsubscribe();
  }
}
