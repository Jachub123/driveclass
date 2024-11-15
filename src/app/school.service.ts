import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { School } from './search-drive-class/driving-school/school.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  invalidSchools = new Subject<School>();
  constructor(
    private db: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private http: HttpClient
  ) {}
  schoolCache = new Subject<School>();
  schools = new Subject<School[]>();
  school = new Subject<School>();
  mySchool = new Subject<School>();
  private incommingSchool: School = {
    automat: false,
    email: '',
    handgeschaltet: false,
    name: '',
    img: '',
    infoText: '',
    postalCode: 0,
    rating: 0,
    nothelferkurs: false,
    preisLektionen: 0,
    preisVerkehrskunde: 0,
    preisNothelferKurs: 0,
    sprache: '',
    stadt: '',
    kanton: '',
    vorwahl: '',
    telefon: '',
    verkehrskunde: false,
    webseite: '',
    abo: '',
    schule: '',
    profilename: '',
    payrexxUuid: '',
    valid: '',
  };
  language = new Subject<String>();
  languageSelected: String;
  endpoint = 'https://api-free.deepl.com/v2/translate';
  authKey = 'dbc5f054-b4f3-e6d4-b4ed-571ebc2f473c:fx';

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getTranslation(text, fromLanguage, targetLanguage): Observable<any> {
    var sourceLangString = '';
    if (fromLanguage) {
      sourceLangString = '&source_lang=' + fromLanguage;
    }

    return this.http
      .get(
        this.endpoint +
          '?auth_key=' +
          this.authKey +
          '&text=' +
          text +
          sourceLangString +
          '&target_lang=' +
          targetLanguage
      )
      .pipe(map(this.extractData));
  }

  fetchSchools(email = '') {
    this.db
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection('school')
      .get()
      .subscribe((response) => {
        response.docs.map((response2) => {
          console.log(new Date(response2.data()['school'].valid).toISOString());
          console.log(Date.parse(response2.data()['school'].valid));

          if (
            Date.parse(response2.data()['school'].valid) -
              new Date().getTime() >=
            0
          ) {
            const schools = this.fireStorage.ref(
              `/${response2.data()['school']['name']}/`
            );
            schools.listAll().subscribe((school) => {
              this.fireStorage
                .ref(
                  `${response2.data()['school']['name']}/${
                    response2.data()['school']['img']
                  }`
                )
                .getDownloadURL()
                .subscribe((url) => {
                  if (email === '') {
                    this.schoolCache.next({
                      ...response2.data()['school'],
                      img: url,
                    });
                  } else {
                    if (response2.data()['school']['profilename'] === email) {
                      this.schoolCache.next({
                        ...response2.data()['school'],
                        img: url,
                        imgName: response2.data()['school'].img,
                      });
                    }
                  }
                });
            });
          } else {
            if (response2.data()['school']['profilename'] === email) {
              this.invalidSchools.next(response2.data()['school']);
            }
          }
        });
      });
  }

  /*   getSchool(email: string) {
    this.db
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection('school')
      .get()
      .subscribe((schoolList) => {
        schoolList.docs.map((school) => {
          const schoolData = school.data()['school'];
          if (schoolData['email'] === email) {
            this.mySchool.next(schoolData);
          }
        });
      });
  } */

  getAllSchools() {
    return this.incommingSchool;
  }

  setSchool(form): any {
    this.incommingSchool = {
      ...this.incommingSchool,
      ...form,
    };
    this.school.next(this.incommingSchool);
  }
}
