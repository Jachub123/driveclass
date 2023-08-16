import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private http: HttpClient) {}
  @ViewChild('f') form: NgModel;

  register() {
    console.log(this.form.value.area);
    console.log(this.form.value.img);
    console.log(this.form.value.infoText);
    console.log(this.form.value.schoolname);
    console.log(this.form.value.postalCode);
    const school = [
      {
        area: this.form.value.area,
        img: this.form.value.img,
        infoText: this.form.value.infoText,
        name: this.form.value.schoolname,
        postalCode: this.form.value.postalCode,
        rating: 0,
      },
    ];
    this.http
      .post(
        'https://drive-schools-3fa8f-default-rtdb.europe-west1.firebasedatabase.app/schools.json',
        school
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
