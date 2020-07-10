import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../core/core.module';

import { State } from '../examples.state';

@Component({
  selector: 'nzuqi-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  examples = [
    { link: 'todos', label: 'nzuqi.examples.menu.todos' },
    { link: 'stock-market', label: 'nzuqi.examples.menu.stocks' },
    { link: 'theming', label: 'nzuqi.examples.menu.theming' },
    { link: 'crud', label: 'nzuqi.examples.menu.crud' },
    {
      link: 'simple-state-management',
      label: 'nzuqi.examples.menu.simple-state-management'
    },
    { link: 'form', label: 'nzuqi.examples.menu.form' },
    { link: 'notifications', label: 'nzuqi.examples.menu.notifications' },
    { link: 'elements', label: 'nzuqi.examples.menu.elements' },
    { link: 'authenticated', label: 'nzuqi.examples.menu.auth', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}
