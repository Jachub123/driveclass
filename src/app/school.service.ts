import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { School } from './search-drive-class/driving-school/school.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  constructor(
    private db: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {}
  schoolCache = [];
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
  private incommingSchools: School[] = [
    {
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
    },
  ];

  async fetchImagesForSchools() {
    const schoolsWithImages = [];
    const fetchImagePromises = [];

    for (const school of this.incommingSchools) {
      const storageRef = this.fireStorage.ref(`/${school.name}/${school.img}`);
      const fetchImagePromise = lastValueFrom(storageRef.getDownloadURL());

      fetchImagePromises.push(fetchImagePromise);

      fetchImagePromise.then((url) => {
        const schoolWithImage = { ...school, img: url };
        schoolsWithImages.push(schoolWithImage);
      });
      await Promise.all(fetchImagePromises);

      this.schools.next(schoolsWithImages);
    }
  }

  fetchSchools() {
    this.incommingSchools = [];
    this.schoolCache = [];
    this.db
      .collection('schools')
      .doc('T4GpuQlOBycURI4BzvG2')
      .collection('school')
      .get()
      .subscribe((response) => {
        response.docs.map((response2) => {
          this.schoolCache.push(response2.data()['school']);

          this.schools.next(this.incommingSchools);
          this.incommingSchools = this.schoolCache;
          this.fetchImagesForSchools();
        });
      });
  }

  getAllSchools() {
    return this.incommingSchool;
  }

  setSchool(page, form): any {
    console.log(form);
    this.incommingSchool = {
      ...this.incommingSchool,
      ...form,
    };
    this.school.next(this.incommingSchool);
  }
}
