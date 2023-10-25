import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { School } from './search-drive-class/driving-school/school.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  constructor(
    private db: AngularFirestore,
    private fireStorage: AngularFireStorage
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
  };

  fetchSchools(email = '') {
    this.db
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection('school')
      .get()
      .subscribe((response) => {
        response.docs.map((response2) => {
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
                  `${school.prefixes[0]?.fullPath}/${
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
