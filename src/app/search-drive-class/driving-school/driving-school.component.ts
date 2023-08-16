import { Component, Input, OnInit } from '@angular/core';
import { SchoolService } from 'src/app/school.service';

@Component({
  selector: 'app-driving-school',
  templateUrl: './driving-school.component.html',
  styleUrls: ['./driving-school.component.scss'],
})
export class DrivingSchoolComponent implements OnInit {
  constructor(private schoolService: SchoolService) {}
  @Input() school: {
    name: string;
    img: string;
    infoText: string;
    area: string;
    postalCode: number;
    rating: number;
  };

  @Input() schoolId: number;

  onClickSchool() {}

  ngOnInit(): void {}
}
