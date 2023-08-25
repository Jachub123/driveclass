import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SchoolService } from '../school.service';
import { School } from './driving-school/school.model';

@Component({
  selector: 'app-search-drive-class',
  templateUrl: './search-drive-class.component.html',
  styleUrls: ['./search-drive-class.component.scss'],
})
export class SearchDriveClassComponent implements OnInit {
  constructor(private schoolService: SchoolService) {}
  @ViewChild('f') form: NgForm;
  selectedSchoolType: string = 'fahrschule';
  schools: School[];
  img: string;
  filteredSchools: School[];

  filterSchools() {
    const value = this.form.value;
    let formHasValue: boolean = false;

    for (let school in value) {
      if (value[school] !== '') {
        formHasValue = true;
      }
    }

    if (formHasValue) {
      this.filteredSchools = [];
      this.schools.map((school) => {
        let isSchoolnameEqSearchedName = school.name
          .toLowerCase()
          .includes(
            value.driveClassSearchbar !== ''
              ? value.driveClassSearchbar.toLowerCase()
              : false
          );
        let isPostCodeEqSearchedPCode = school.postalCode == value.plz;

        if (value.driveClassSearchbar !== '') {
          if (isSchoolnameEqSearchedName) {
            let updatedArr = [school];
            this.filteredSchools.push(...updatedArr);
          }
        }
        if (value.plz !== '') {
          if (this.filteredSchools.length !== 0) {
            if (isSchoolnameEqSearchedName) {
              return;
            } else {
              if (isPostCodeEqSearchedPCode) {
                let updatedArr = [school];
                this.filteredSchools.push(...updatedArr);
              }
            }
          } else {
            if (isPostCodeEqSearchedPCode) {
              let updatedArr = [school];
              this.filteredSchools.push(...updatedArr);
            }
          }
        }
        if (value.schoolType !== '') {
          if (this.filteredSchools.length !== 0) {
            if (isSchoolnameEqSearchedName || isPostCodeEqSearchedPCode) {
              return;
            } else {
              if (
                school.schule
                  .toLowerCase()
                  .includes(value.schoolType.toLowerCase())
              ) {
                let updatedArr = [school];
                this.filteredSchools.push(...updatedArr);
              }
            }
          } else {
            console.log(school.schule);
            console.log(value.schoolType);
            if (
              school.schule
                .toLowerCase()
                .includes(value.schoolType.toLowerCase())
            ) {
              let updatedArr = [school];
              this.filteredSchools.push(...updatedArr);
            }
          }
        }
        if (value.stadt !== '') {
          if (this.filteredSchools.length !== 0) {
            if (isSchoolnameEqSearchedName || isPostCodeEqSearchedPCode) {
              return;
            } else {
              if (
                school.stadt.toLowerCase().includes(value.stadt.toLowerCase())
              ) {
                let updatedArr = [school];
                this.filteredSchools.push(...updatedArr);
              }
            }
          } else {
            if (
              school.stadt.toLowerCase().includes(value.stadt.toLowerCase())
            ) {
              let updatedArr = [school];
              this.filteredSchools.push(...updatedArr);
            }
          }
        }
      });
    } else {
      this.filteredSchools = this.schools;
    }
  }

  ngOnInit() {
    this.schoolService.fetchSchools();
    this.filteredSchools = this.schools;
    this.schoolService.schools.subscribe((school) => {
      this.schools = school;
      this.filteredSchools = this.schools;
    });

    /*       this.fireStorage
        .ref(`/${school[index].name}/images`)
        .getDownloadURL()
        .subscribe((url) => {
          console.log(url);
          this.schools[index].img = url;
          console.log(this.schools);
        }); */
  }
}
