import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/register/auth-service.service';
import { SchoolService } from 'src/app/school.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-edit-school',
  templateUrl: './edit-school.component.html',
  styleUrls: ['./edit-school.component.scss'],
})
export class EditSchoolComponent implements OnInit {
  id: string;
  schoolSub: Subscription;
  school: any;
  render: boolean;
  file: any;
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private schoolService: SchoolService,
    private db: AngularFirestore,
    private angFire: AngularFireStorage
  ) {}

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
        .set({ school: { ...this.school, img: this.school.imgName } });
      /*     this.angFire.upload(
      
      this.schoolservice.getAllSchools().name + '/' + this.file.name,
      this.file
    ); */
    });
  }

  upload(event) {
    this.file = event.target.files[0];
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
        console.log(school);
      });
    }
  }
}
