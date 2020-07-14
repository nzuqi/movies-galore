import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { routeAnimations } from '../../core/core.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
