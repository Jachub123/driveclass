import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('navCollapsable') nav: ElementRef;

  toggleNav() {
    this.nav.nativeElement.classList.toggle('collapse');
  }
}
