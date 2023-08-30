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
    private route: ActivatedRoute
  ) {}
  id: string;
  schools: School[] = [];
  school: School;
  render: boolean = false;
  ngOnInit() {
    this.schools = [];
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    if (this.schools.length === 0) {
      this.schoolService.fetchSchools();
    }
    this.schoolService.schoolCache.subscribe((obj) => {
      if (obj.name === this.id) {
        this.render = true;
        this.school = obj;
      }
    });
  }
}
