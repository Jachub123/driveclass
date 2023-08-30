import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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
    abo: 0,
    schule: '',
  };

  fetchSchools() {
    this.db
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection('school')
      .get()
      .subscribe((response) => {
        response.docs.map((response2) => {
          this.fireStorage
            .ref(
              `/${response2.data()['school']['name']}/${
                response2.data()['school']['img']
              }`
            )
            .getDownloadURL()
            .subscribe((url) => {
              this.schoolCache.next({
                ...response2.data()['school'],
                img: url,
              });
            });
        });
      });
  }

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
