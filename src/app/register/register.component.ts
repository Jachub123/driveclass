import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SchoolService } from '../school.service';
import { School } from '../search-drive-class/driving-school/school.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth-service.service';
import { ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  user: any;
  sub: any;
  langChangeSub: Subscription;
  langSub: Subscription;
  text: Array<String> = [
    'Registriere deine Fahrschule/Berufsschule bei Driveclass',
    'Alles über deine Fahrschule/Berufsschule',
    'Berufsschule',
    'Fahrschule',
    '*Name deiner Fahrschule/Berufsschule:',
    'z.B. "Drive Safe Fahrschule/Berufsschule Kernten"',
    'Dies ist ein Pflichtfeld, bitte ausfüllen!',
    '*E-Mail',
    'mit diesem Namen Meldest du dich an',
    '*Passwort',
    'Mach es sicher!',
    '*Bild deiner Fahrschule/Berufsschule',
    '*Stadt deiner Fahrschule/Berufsschule',
    '*Kanton',
    '*Postleitzahl',
    'Info-Text zu deiner Fahrschule/Berufsschule',
    'erzähl etwas über deine Fahrschule/Berufsschule',
    'Was bietet deine Fahrschule/Berufsschule an?',
    '(Achtung: bei nicht ankreuzen, gibst du an dass deine Fahrschule/Berufsschule dies nicht anbietet)',
    'Handgeschaltet',
    'Automat',
    'Verkehrskunde',
    'Nothelferkurs',
    '*Sprachen',
    'bitte mit Komma getrennt angeben: englisch, deutsch, französisch',
    'Was verlangst du für:',
    'eine Lektion',
    'Verkehrskunde',
    'Nothelferkurs',
    'Kontaktdaten zu deiner Fahrschule/Berufsschule',
    '*Vorwahl',
    'Schweiz',
    'Griechenland',
    'Niederlande',
    'Belgien',
    'Frankreich',
    'Spanien',
    'Italien',
    'Rumänien',
    'Österreich',
    'Deutschland',
    '*Telefonnummer der Fahrschule/Berufsschule',
    'Bitte erste Null weg lassen',
    '*Webseite der Fahrschule/Berufsschule',
    'Dein Abo',
    'übersichtliches Profil',
    'SEO optimierte Inhalte',
    'laufende Updates',
    'aktive promotion auf Social Media',
    'Premium Abo Fahrschule Monatlich',
    'Premium Abo Fahrschule Jährlich',
    'Premium Abo Berufsschule Monatlich',
    'Premium Abo Berufsschule Jährlich',
    'zurück zu',
    'weiter zu',
  ];
  constructor(
    private angFire: AngularFireStorage,
    private db: AngularFirestore,
    private schoolservice: SchoolService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    window.addEventListener('message', this.handleMessage.bind(this), false);

    this.schoolservice.school.subscribe((response) => {
      this.school = response;
      this.name = response.name;
    });
  }
  @ViewChild('f', { static: false }) form: NgModel;
  @ViewChild('heading', { static: false }) heading: ElementRef;
  @ViewChild('img', { static: false }) imgInput: ElementRef;

  @ViewChild('payrexxIframe', { static: false }) payrexxIframe: ElementRef;
  errorMsg: string;
  successMsg: string;
  pageCount: number = 1;
  name: string;
  profilename: string;
  automat: boolean = true;
  verkehrskunde: boolean = true;
  handgeschaltet: boolean = true;
  nothelferkurs: boolean = true;
  email: string;
  img: string;
  infoText: string = '';
  postalCode: number;
  rating: number;
  preisLektionen: number = 0;
  preisVerkehrskunde: number = 0;
  preisNothelferKurs: number = 0;
  sprache: string;
  stadt: string;
  kanton: string;
  vorwahl: string;
  telefon: string;
  nummer: string;
  webseite: string;
  schule: string;
  school: School;
  file: any;
  uid: string;
  abo: string = '';

  upload(event) {
    if (event.target.files[0].size > 5 * 1024 * 1024) {
      this.errorMsg += ' Das Bild darf nicht größer als 5MB sein. ';
      this.imgInput.nativeElement.value = '';
      return;
    } else {
      this.errorMsg = '';
      this.file = event.target.files[0];
    }
  }

  onCreateUser(user) {
    this.authService.createUser(user);
  }
  scrollToAnchor(anchor: string): void {
    // Use the anchor name to scroll to the element
    setTimeout(() => {
      const element = this.heading.nativeElement;

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  next() {
    if (this.form.valid) {
      if (this.pageCount === 1) {
        if (this.form.value.name.length < 3) {
          this.errorMsg += ' Der Name muss mindestens 3 Buchstaben enthalten. ';
          return;
        }
        this.db
          .collection('schools')
          .doc('T4GpuQlOBycURI4BzvG2')
          .collection('school')
          .get()
          .subscribe((schools) => {
            let usernameExists = false;
            let nameExists = false;

            schools.docs.forEach((school) => {
              const schoolData = school.data()['school'];

              if (schoolData['profilename'] === this.form.value.profilename) {
                usernameExists = true;
              }

              if (schoolData['name'] === this.form.value.name) {
                nameExists = true;
              }
            });

            if (usernameExists || nameExists) {
              // Display the error message if either username or email exists
              if (usernameExists) {
                this.errorMsg += ' Die E-Mail existiert bereits! ';
              }
              if (nameExists) {
                this.errorMsg += ' Name der Fahrschule existiert bereits. ';
              }
            } else {
              // No conflicts, proceed with registration

              this.onCreateUser({
                profilename: this.form.value.profilename,
                name: this.form.value.name,
                password: this.form.value.password,
              });
              delete this.form.value.password;
              if (this.file === undefined) {
                return;
              } else {
                this.errorMsg = '';
                this.schoolservice.setSchool(this.form.value);

                this.school = this.schoolservice.getAllSchools();
                this.pageCount += 1;
              }
            }
          });
      } else if (this.errorMsg === '') {
        this.schoolservice.setSchool(this.form.value);
        this.pageCount += 1;
      }
    } else {
      this.form.control.markAllAsTouched();
    }
  }
  back() {
    this.school = this.schoolservice.getAllSchools();
    this.pageCount -= 1;
  }

  register(uuid, valid) {
    this.db
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection('school')
      .doc(this.schoolservice.getAllSchools().name)
      .set({
        school: {
          ...this.schoolservice.getAllSchools(),
          abo: this.abo,
          img: this.file.name,
          payrexxUuid: uuid,
          valid: valid,
        },
      });
    this.successMsg =
      'Deine Fahrschule wurde angelegt! Danke dass du Teil von Driveclass bist!';
    this.angFire.upload(
      this.schoolservice.getAllSchools().name +
        '/' +
        this.user.uid +
        '/' +
        this.file.name,
      this.file
    );
  }

  handleMessage(event: MessageEvent) {
    if (typeof event.data === 'string') {
      try {
        const data = JSON.parse(event.data);
        if (data && data.payrexx) {
          Object.keys(data.payrexx).forEach((name) => {
            switch (name) {
              case 'transaction':
                if (typeof data.payrexx[name] === 'object') {
                  if (data.payrexx[name].status === 'confirmed') {
                    let time = (new Date().getHours() + 1).toString();
                    if (time.toString()[1] === undefined) {
                      time = '0' + time.toString();
                    }

                    // Handle success
                    this.register(
                      data.payrexx.transaction?.subscription?.uuid,
                      data.payrexx.transaction?.subscription?.valid_until +
                        'T' +
                        time +
                        ':00'
                    );
                  } else {
                  }
                }
                break;
            }
          });
        }
      } catch (error) {}
    }
  }

  showFrame() {
    const iFrame = this.payrexxIframe.nativeElement;
    const iFrameOrigin = new URL(iFrame.src).origin;

    iFrame.contentWindow.postMessage(
      JSON.stringify({
        origin: window.location.origin,
      }),
      iFrameOrigin
    );
  }

  ngOnInit() {
    this.langChangeSub = this.schoolservice.language.subscribe((lang) => {
      for (let i = 0; i < this.text.length; i++) {
        this.schoolservice
          .getTranslation(this.text[i], localStorage.getItem('lang'), lang)
          .subscribe((result) => {
            this.text[i] = result.translations[0].text;
          });
      }
    });

    if (localStorage.getItem('lang') !== 'DE') {
      for (let i = 0; i < this.text.length; i++) {
        this.langSub = this.schoolservice
          .getTranslation(this.text[i], 'DE', localStorage.getItem('lang'))
          .pipe(first())
          .subscribe((result) => {
            this.text[i] = result.translations[0].text;
          });
      }
    }

    this.scrollToAnchor('heading');

    this.authService.getUser();
    this.sub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.langSub.unsubscribe();
    this.langChangeSub.unsubscribe();
  }
}
