import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SchoolService } from '../school.service';

@Component({
  selector: 'app-search-drive-class',
  templateUrl: './search-drive-class.component.html',
  styleUrls: ['./search-drive-class.component.scss'],
})
export class SearchDriveClassComponent implements OnInit {
  constructor(private schoolService: SchoolService) {}
  @ViewChild('f') form: NgForm;

  schools: {
    name: string;
    img: string;
    infoText: string;
    area: string;
    postalCode: number;
    rating: number;
  }[];

  filteredSchools: {
    name: string;
    img: string;
    infoText: string;
    area: string;
    postalCode: number;
    rating: number;
  }[];

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
            value.driveClassSearchbar.toLowerCase() !== ''
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
        if (value.area !== '') {
          if (this.filteredSchools.length !== 0) {
            if (isSchoolnameEqSearchedName || isPostCodeEqSearchedPCode) {
              return;
            } else {
              if (
                school.area.toLowerCase().includes(value.area.toLowerCase())
              ) {
                let updatedArr = [school];
                this.filteredSchools.push(...updatedArr);
              }
            }
          } else {
            if (school.area.toLowerCase().includes(value.area.toLowerCase())) {
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
    this.schoolService.schools.subscribe((school) => {
      this.schools = school;
      this.filteredSchools = this.schools;
    });
  }
}
