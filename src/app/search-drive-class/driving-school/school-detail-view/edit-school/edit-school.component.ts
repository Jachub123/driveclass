import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/register/auth-service.service';
import { SchoolService } from 'src/app/school.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-school',
  templateUrl: './edit-school.component.html',
  styleUrls: ['./edit-school.component.scss'],
})
export class EditSchoolComponent implements OnInit {
  ack: boolean = false;
  warn: boolean = false;
  id: string;
  schoolSub: Subscription;
  school: any;
  render: boolean;
  file: any;
  msg: string;
  user: any;
  warn1: string = 'bist du dir sicher, dass du dein ';
  warn2: string = 'möchtest?';
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private schoolService: SchoolService,
    private db: AngularFirestore,
    private angFire: AngularFireStorage,
    private http: HttpClient
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  async updateSchool() {
    const imgPath = this.angFire.ref(
      this.school.name + '/' + this.school.imgName
    );
    if (this.file !== undefined) {
      await imgPath.put(this.file);
    }
    imgPath.getDownloadURL().subscribe((url) => {
      this.db
        .collection('schools')
        .doc('T4GpuQlOBycURI4BzvG2')
        .collection('school')
        .doc(this.school.name)
        .update({ school: { ...this.school, img: this.school.imgName } });
      /*     this.angFire.upload(
      
      this.schoolservice.getAllSchools().name + '/' + this.file.name,
      this.file
    ); */
    });
  }

  upload(event) {
    this.file = event.target.files[0];
  }

  makeHttpsRequest(): void {
    const url = '/.netlify/functions/webhook?' + this.user.email;
    // Replace with your actual API endpoint

    // Make an HTTPS POST request

    this.http.post<any>(url, this.user.email).subscribe((data) => {
      this.msg = 'Abo wird gekündigt...';
      if (data.success) {
        this.msg = 'Dein Abonnement wurde gekündigt.';
        this.warn = false;
      } else {
        this.msg = 'Etwas ist schief gelaufen. Bitte versuche es erneut.';
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    if (this.auth.isLoggedIn()) {
      this.schoolService.fetchSchools(
        JSON.parse(localStorage.getItem('user')!).email
      );
      this.schoolSub = this.schoolService.schoolCache.subscribe((school) => {
        this.school = school;
        this.render = true;
      });
    }
  }
}
