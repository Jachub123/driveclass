import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SchoolService } from '../school.service';
import { School } from './driving-school/school.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../register/auth-service.service';

@Component({
  selector: 'app-search-drive-class',
  templateUrl: './search-drive-class.component.html',
  styleUrls: ['./search-drive-class.component.scss'],
})
export class SearchDriveClassComponent implements OnInit, OnDestroy {
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

    if (formValue.plz !== '' && formValue.plz !== null) {
      resultPostalC = this.schools.filter((item) =>
        item.postalCode.toString().includes(formValue.plz.toString())
      );
    }
    if (
      formValue.driveClassSearchbar !== '' &&
      formValue.driveClassSearchbar !== null
    ) {
      resultName = this.schools.filter((item) =>
        this.searchedName(item.name, formValue.driveClassSearchbar)
      );
    }
    if (formValue.stadt !== '' && formValue.stadt !== null) {
      resultStadt = this.schools.filter((item) =>
        this.searchedName(item.kanton, formValue.stadt)
      );
    }
    if (formValue.lang !== '' && formValue.lang !== null) {
      resultSprache = this.schools.filter((item) =>
        this.searchedName(item.sprache, formValue.lang)
      );
    }
    if (
      formValue.schoolType !== 'fahrschule' &&
      formValue.schoolType !== null
    ) {
      resultschoolType = this.schools.filter((item) =>
        this.searchedName(item.schule, formValue.schoolType)
      );
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
    this.authService.loggedIn();

    if (this.schools.length === 0) {
      this.schoolService.fetchSchools();
    }

    this.schoolSub = this.schoolService.schoolCache.subscribe((obj) => {
      this.schools.push(obj);
    });
  }

  ngOnDestroy(): void {
    this.schoolSub.unsubscribe();
  }
}
