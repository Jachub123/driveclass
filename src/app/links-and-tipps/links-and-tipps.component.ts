import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-links-and-tipps',
  templateUrl: './links-and-tipps.component.html',
  styleUrls: ['./links-and-tipps.component.scss'],
  standalone: true,
  imports: [MatExpansionModule],
})
export class LinksAndTippsComponent implements OnInit {
  ngOnInit(): void {}
}
