import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SchoolService } from 'src/app/school.service';
import { School } from '../school.model';

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
  school: School[];
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });

    this.schoolService.fetchSchools();
    this.schoolService.schools.subscribe((school) => {
      this.school = school;
      console.log(this.school[this.id]);
    });

    //this.school = this.schoolService.getAllSchools();
  }
}
