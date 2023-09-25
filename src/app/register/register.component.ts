import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SchoolService } from '../school.service';
import { School } from '../search-drive-class/driving-school/school.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  user: any;
  sub: any;
  constructor(
    private angFire: AngularFireStorage,
    private db: AngularFirestore,
    private schoolservice: SchoolService,
    private authService: AuthService
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
  uid: string;

  upload(event) {
    this.file = event.target.files[0];
  }

  onCreateUser(user) {
    this.authService.createUser(user);
  }

  next() {
    this.errorMsg = '';
    if (this.form.valid) {
      if (this.pageCount === 1) {
        if (this.form.value.name.length < 3) {
          this.errorMsg += 'Der Name muss mindestens 3 Buchstaben enthalten.';
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
                this.errorMsg += 'Die E-Mail existiert bereits! ';
              }
              if (nameExists) {
                this.errorMsg += 'Name der Fahrschule existiert bereits. ';
              }
            } else {
              // No conflicts, proceed with registration

              this.onCreateUser({
                profilename: this.form.value.profilename,
                name: this.form.value.name,
                password: this.form.value.password,
              });
              delete this.form.value.password;
              this.schoolservice.setSchool(this.form.value);

              this.school = this.schoolservice.getAllSchools();
              this.pageCount += 1;
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

  register() {
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
      this.schoolservice.getAllSchools().name +
        '/' +
        this.user.uid +
        '/' +
        this.file.name,
      this.file
    );
  }

  ngOnInit() {
    this.authService.getUser();
    this.sub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
