import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.post(
      'http://134.3.10.133:8888/.netlify/functions/webhook',
      'lol'
    );
  }
}
