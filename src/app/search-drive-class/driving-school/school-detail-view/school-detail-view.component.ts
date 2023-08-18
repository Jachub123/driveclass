import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SchoolService } from 'src/app/school.service';

@Component({
  selector: 'app-school-detail-view',
  templateUrl: './school-detail-view.component.html',
  styleUrls: ['./school-detail-view.component.scss'],
})
export class SchoolDetailViewComponent implements OnInit {
  constructor(
    private schoolService: SchoolService,
    private route: ActivatedRoute
  ) {}
  id: number;
  school: {
    name: string;
    img: string;
    infoText: string;
    area: string;
    postalCode: number;
    rating: number;
  }[];
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });
    if (this.schoolService.getAllSchools() === undefined) {
      this.schoolService.fetchSchools();
      this.schoolService.schools.subscribe((school) => {
        this.school = school;
      });
    } else {
      this.school = this.schoolService.getAllSchools();
    }
  }
}
