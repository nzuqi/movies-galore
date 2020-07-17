import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFavoritesComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  loading: boolean = false;
  no_data: boolean = false;
  shows: any[] = [];
  private unsubscribe: Subject<any>;

  constructor(
    private http: HttpClient,
		private cdr: ChangeDetectorRef,
  ) {
		this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    this.loading = true;
    this.no_data = false;
    this.getShows();
  }

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getShows() {
		this.showsServerData()
			.pipe(
				tap(_resp => {
          // console.log(_resp);
          if(_resp['response_code'] == '200') {
            this.shows = _resp['data']['shows'];
            if(_resp['data']['shows'].length == 0) this.no_data = true;
          }
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
          this.loading = false;
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}

  showsServerData(): Observable<any> {
    const _localData: any = JSON.parse(localStorage.getItem('mvgUser'));
    const _data = {
      user_id: _localData['id'],
    };
    return this.http.post<any>("https://martin.co.ke/mvg/api/get_favorites", _data, {});
  }

}
