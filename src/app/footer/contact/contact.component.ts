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
      'https://ephemeral-biscochitos-b29449.netlify.app/.netlify/functions/webhook',
      'lol'
    );
  }
}
