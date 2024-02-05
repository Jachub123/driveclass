import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SchoolService } from '../school.service';
import { School } from './driving-school/school.model';
import { Subscription, first } from 'rxjs';
import { AuthService } from '../register/auth-service.service';

@Component({
  selector: 'app-search-drive-class',
  templateUrl: './search-drive-class.component.html',
  styleUrls: ['./search-drive-class.component.scss'],
})
export class SearchDriveClassComponent implements OnInit, OnDestroy {
  langSub: Subscription;
  langChangeSub: Subscription;
  constructor(
    private schoolService: SchoolService,
    private authService: AuthService
  ) {}

  @ViewChild('f') form: NgForm;
  selectedSchoolType: string = 'fahrschule';
  schools: School[] = [];
  img: string;
  filteredSchools: School[] = [];
  schoolSub: Subscription;
  count = 0;
  text = [
    'Firma/Schule',
    'Fahrschule',
    'Berufsschule',
    'Suche nach',
    'Postleitzahl',
    'Gebiet',
    'Sprache ',
    'Suchen',
    'Fahrschulen oder Berufsschulen in deiner Nähe',
  ];
  headerSearchList = 'Fahrschulen oder Berufsschulen in deiner Nähe';
  searchfield1 = 'Suche nach';
  searchfield2 = 'Firma/Schule';
  searchedName(word, searchBar) {
    //gib den Namen zurück der dem eingegebenen Suchfeldbegriff entspricht.
    return word.toLowerCase().includes(searchBar.toLowerCase());
  }

  filterSchools() {
    const formValue = this.form.value;

    let mergedArray = [];
    let resultPostalC: School[] = [];
    let resultName: School[] = [];
    let resultStadt: School[] = [];
    let resultSprache: School[] = [];
    let resultschoolType: School[] = [];
    let allArrays = [];
    this.filteredSchools = [];

    if (
      formValue.schoolType !== 'fahrschule' &&
      formValue.schoolType !== null
    ) {
      resultschoolType = this.schools.filter((item) =>
        this.searchedName(item.schule, formValue.schoolType)
      );
    }

    if (formValue.plz !== '' && formValue.plz !== null) {
      if (resultschoolType.length > 0) {
        resultPostalC = resultschoolType.filter((item) =>
          item.postalCode.toString().includes(formValue.plz.toString())
        );
      } else {
        resultPostalC = this.schools.filter((item) =>
          item.postalCode.toString().includes(formValue.plz.toString())
        );
      }
    }
    if (
      formValue.driveClassSearchbar !== '' &&
      formValue.driveClassSearchbar !== null
    ) {
      if (resultschoolType.length > 0) {
        resultName = resultschoolType.filter((item) =>
          this.searchedName(item.name, formValue.driveClassSearchbar)
        );
      } else {
        resultName = this.schools.filter((item) =>
          this.searchedName(item.name, formValue.driveClassSearchbar)
        );
      }
    }
    if (formValue.stadt !== '' && formValue.stadt !== null) {
      if (resultschoolType.length > 0) {
        resultStadt = resultschoolType.filter((item) =>
          this.searchedName(item.kanton, formValue.stadt)
        );
      } else {
        resultStadt = this.schools.filter((item) =>
          this.searchedName(item.kanton, formValue.stadt)
        );
      }
    }
    if (formValue.lang !== '' && formValue.lang !== null) {
      if (resultschoolType.length > 0) {
        resultSprache = resultschoolType.filter((item) =>
          this.searchedName(item.sprache, formValue.lang)
        );
      } else {
        resultSprache = this.schools.filter((item) =>
          this.searchedName(item.sprache, formValue.lang)
        );
      }
    }
    allArrays = [
      resultName,
      resultPostalC,
      resultStadt,
      resultSprache,
      resultschoolType,
    ];

    allArrays.forEach((currentArray) => {
      currentArray.forEach((obj: School) => {
        const existingObj = mergedArray.find((item) => item.name === obj.name);
        if (existingObj) {
          Object.assign(existingObj, obj);
        } else {
          mergedArray.push(obj);
        }
      });
    });

    this.filteredSchools = mergedArray;
  }

  ngOnInit() {
    if (this.schools.length === 0) {
      this.schoolService.fetchSchools();
    }

    this.langChangeSub = this.schoolService.language.subscribe((lang) => {
      for (let i = 0; i < this.text.length; i++) {
        this.schoolService
          .getTranslation(this.text[i], '', lang)
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
    this.schoolSub = this.schoolService.schoolCache.subscribe((obj) => {
      this.schools.push(obj);
    });
  }

  ngOnDestroy(): void {
    this.schoolSub.unsubscribe();
    this.langSub?.unsubscribe();
    this.langChangeSub?.unsubscribe();
  }
}
