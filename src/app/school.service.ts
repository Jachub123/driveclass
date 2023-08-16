import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  constructor(private http: HttpClient) {}

  schools = new Subject<
    {
      name: string;
      img: string;
      infoText: string;
      area: string;
      postalCode: number;
      rating: number;
    }[]
  >();
  private incommingSchools: {
    name: string;
    img: string;
    infoText: string;
    area: string;
    postalCode: number;
    rating: number;
  }[];

  fetchSchools() {
    this.http
      .get(
        'https://drive-schools-3fa8f-default-rtdb.europe-west1.firebasedatabase.app/schools.json'
      )
      .pipe(
        map((responseData) => {
          const postArray = [];
          for (const key in responseData) {
            postArray.push(...responseData[key]);
          }
          return postArray;
        })
      )
      .subscribe((schools) => {
        this.schools.next(schools);
        this.incommingSchools = schools;
      });
  }

  getAllSchools() {
    return this.incommingSchools;
  }
}
