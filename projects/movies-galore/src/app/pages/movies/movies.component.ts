import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { routeAnimations, selectIsAuthenticated } from '../../core/core.module';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from './movies.state';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  pages = [
    { link: './', label: 'app.movies.library' },
    // { link: 'search', label: 'app.movies.search' },
    { link: 'future-episodes', label: 'app.movies.schedule' },
    // { link: 'people', label: 'app.movies.people' },
    { link: 'watch-later', label: 'app.movies.later', auth: true },
    { link: 'my-favorites', label: 'app.movies.favorites', auth: true },
    { link: 'my-comments', label: 'app.movies.comments', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}
