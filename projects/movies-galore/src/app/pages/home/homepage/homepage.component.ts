import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  releaseButler = '../../../../assets/release-butler.png';
  search_query = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  onQueryChange(q: string) {
    this.search_query = q.trim();
  }

  search() {
    this.router.navigateByUrl('/movies/library?s=' + this.search_query);
  }
}
