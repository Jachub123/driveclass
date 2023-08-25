import { Component, Input, OnInit } from '@angular/core';
import { SchoolService } from 'src/app/school.service';
import { School } from './school.model';

@Component({
  selector: 'app-driving-school',
  templateUrl: './driving-school.component.html',
  styleUrls: ['./driving-school.component.scss'],
})
export class DrivingSchoolComponent implements OnInit {
  constructor(private schoolService: SchoolService) {}
  @Input() school: School;

  @Input() schoolId: number;

  onClickSchool() {}

  ngOnInit(): void {}
}
