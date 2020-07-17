import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.component.html',
  styleUrls: ['./my-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyCommentsComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  loading: boolean = false;
  no_data: boolean = false;
  comments: any[] = [];

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
    this.getComments();
  }

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getComments() {
		this.commentsServerData()
			.pipe(
				tap(_resp => {
          // console.log(_resp);
          if(_resp['response_code'] == '200') {
            this.comments = _resp['data']['comments'];
            if(_resp['data']['comments'].length == 0) this.no_data = true;
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

  commentsServerData(): Observable<any> {
    const _localData: any = JSON.parse(localStorage.getItem('mvgUser'));
    const _data = {
      user_id: _localData['id'],
    };
    return this.http.post<any>("https://martin.co.ke/mvg/api/get_comments", _data, {});
  }

}
