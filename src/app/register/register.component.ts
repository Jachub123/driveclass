import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private http: HttpClient, private db: AngularFirestore) {}
  @ViewChild('f') form: NgModel;
  errorMsg: string;
  successMsg: string;

  register() {
    this.errorMsg = '';
    if (this.form.valid) {
      /*   
    const options = { method: 'GET' };
    fetch(
      'https://emailvalidation.abstractapi.com/v1?api_key=a8a36a6639a24f23a6b2a5234678a96a&email=' +
        this.form.value.email,
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err)); */

      console.log(this.form.control);

      const school = {
        automat: this.form.value.automat,
        email: '',
        handgeschaltet: this.form.value.handgeschaltet,
        name: this.form.value.schoolname,
        img: this.form.value.img,
        infoText: this.form.value.infoText,
        postalCode: this.form.value.postalCode,
        rating: 0,
        nothelferkurs: this.form.value.nothelferkurs,
        preisliste: {
          preisLektionen: this.form.value.preisLektionen,
          preisVerkehrskunde: this.form.value.preisVerkehrskunde,
          preisNothelferKurs: this.form.value.preisNothelferKurs,
        },
        sprache: this.form.value.sprache,
        stadt: this.form.value.area,
        telefon: 0,
        verkehrskunde: this.form.value.nothelferkurs,
        webseite: '',
      };

      this.db
        .collection('schools')
        .doc('T4GpuQlOBycURI4BzvG2')
        .collection(this.form.value.schoolname)
        .get()
        .subscribe((response) => {
          if (response.docs.length !== 0) {
            this.errorMsg += 'Name der Fahrschule existiert bereits.';
            return;
          } else {
            if (this.form.value.schoolname.length < 3) {
              this.errorMsg +=
                'Der Name muss mindestens 3 Buchstaben enthalten.';
            } else {
              this.db
                .collection('schools')
                .doc('T4GpuQlOBycURI4BzvG2')
                .collection(this.form.value.schoolname)
                .add({ school: school });
              this.successMsg =
                'Deine Fahrschule wurde angelegt! Danke dass du Teil von Driveclass bist!';
            }
          }
        });
    } else {
      this.form.control.markAllAsTouched();
    }
  }
}
