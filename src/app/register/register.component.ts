import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SchoolService } from '../school.service';
import { School } from '../search-drive-class/driving-school/school.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private angFire: AngularFireStorage,
    private db: AngularFirestore,
    private schoolservice: SchoolService
  ) {
    this.schoolservice.school.subscribe((response) => {
      this.school = response;
      this.name = response.name;
    });
  }
  @ViewChild('f') form: NgModel;
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

  upload(event) {
    this.file = event.target.files[0];
  }

  next() {
    console.log(this.form.value);
    this.errorMsg = '';
    if (this.form.valid) {
      const options = { method: 'GET' };

      this.schoolservice.setSchool(this.pageCount, this.form.value);
      console.log('this.school');
      console.log(this.school);
      this.school = this.schoolservice.getAllSchools();
      this.db
        .collection('schools')
        .doc('T4GpuQlOBycURI4BzvG2')
        .collection('school')
        .doc(this.schoolservice.getAllSchools().name)
        .get()
        .subscribe((response) => {
          if (response.exists) {
            this.errorMsg += 'Name der Fahrschule existiert bereits.';
            return;
          } else if (this.schoolservice.getAllSchools().name.length < 3) {
            this.errorMsg += 'Der Name muss mindestens 3 Buchstaben enthalten.';
            return;
          }
          this.pageCount += 1;
        });
    } else {
      this.form.control.markAllAsTouched();
    }
  }
  back() {
    this.school = this.schoolservice.getAllSchools();
    this.pageCount -= 1;
  }

  register() {
    this.errorMsg = '';
    if (this.form.valid) {
      this.db
        .collection('schools')
        .doc('T4GpuQlOBycURI4BzvG2')
        .collection('school')
        .doc(this.schoolservice.getAllSchools().name)
        .get()
        .subscribe((response) => {
          if (response.exists) {
            this.errorMsg += 'Name der Fahrschule existiert bereits.';
            return;
          } else {
            if (this.schoolservice.getAllSchools().name.length < 3) {
              this.errorMsg +=
                'Der Name muss mindestens 3 Buchstaben enthalten.';
            } else {
              this.db
                .collection('schools')
                .doc('T4GpuQlOBycURI4BzvG2')
                .collection('school')
                .doc(this.schoolservice.getAllSchools().name)
                .set({
                  school: {
                    ...this.schoolservice.getAllSchools(),
                    img: this.file.name,
                  },
                });
              this.successMsg =
                'Deine Fahrschule wurde angelegt! Danke dass du Teil von Driveclass bist!';
              this.angFire.upload(
                this.schoolservice.getAllSchools().name + '/' + this.file.name,
                this.file
              );
            }
          }
        });
    } else {
      this.form.control.markAllAsTouched();
    }
  }

  ngOnInit() {}
}
