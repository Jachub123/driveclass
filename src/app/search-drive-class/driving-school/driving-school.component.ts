import { Component, Input, OnInit } from '@angular/core';
import { School } from './school.model';

@Component({
  selector: 'app-driving-school',
  templateUrl: './driving-school.component.html',
  styleUrls: ['./driving-school.component.scss'],
})
export class DrivingSchoolComponent implements OnInit {
  @Input() school: School;

  @Input() schoolId: number;

  onClickSchool() {}

  ngOnInit(): void {}
}
