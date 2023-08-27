import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SchoolService } from 'src/app/school.service';
import { School } from '../school.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-school-detail-view',
  templateUrl: './school-detail-view.component.html',
  styleUrls: ['./school-detail-view.component.scss'],
})
export class SchoolDetailViewComponent implements OnInit {
  constructor(
    private schoolService: SchoolService,
    private route: ActivatedRoute,
    private fireStorage: AngularFireStorage
  ) {}
  id: number;
  schools: School[] = [];
  school: School;
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });

    this.schoolService.fetchSchools();
    if (this.schoolService.schoolCache === undefined) {
      this.schoolService.fetchImagesForSchools();
    }

    this.schools = this.schoolService.schoolCache;
    /*     this.schoolService.school.subscribe((school: School) => {
      this.fireStorage
        .ref(`/${school.name}/${school.img}`)
        .getDownloadURL()
        .subscribe((url) => {
          this.schools.push({ ...school, img: url });
        });
    }); */

    //this.school = this.schoolService.getAllSchools();
  }
}
