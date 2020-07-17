import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, authLogin, authLogout } from '../../../core/core.module';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  loginMsg: string = "Signing you in, please wait.";
  processing: boolean = true;
	private unsubscribe: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
		private cdr: ChangeDetectorRef,
    private store: Store,
  ) {
		this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    try {
      const current_url = this.router.url;
      const url_payload = decodeURI(current_url).split("#");
      const payload = url_payload[1].split("&");
      var _payload = {};
      payload.forEach((_load) => {
        var _data = _load.split("=");
        _payload[_data[0]] = _data[1];
      });
      // console.log(_payload);
      this.getGoogleUserData(_payload['access_token']);
    } catch (error) {
      this.router.navigate(['/']);
    }
  }

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getGoogleUserData(access_token: string) {
		this.processGoogleUserData(access_token)
			.pipe(
				tap(user => {
					// console.log(user);
          // this.socialLogin(2, user['id'], user['given_name'], user['family_name'], user['email']);
          const _data = {
            api_key: "vjlMG5wDfeiiHjaZV8Oq97MIrCkkVVZb2",
            data: {
              email: user['email'],
              google_id: user['id'],
              last_name: user['family_name'],
              first_name: user['given_name']
            },
            id: 7719
          };
          this.loginUser(_data).pipe(tap(_dat => {
            // console.log(_dat);
            if(_dat['response_code'] == '200') {
              localStorage.setItem('mvgUser', JSON.stringify(_dat['user']));
              this.store.dispatch(authLogin());
            }else{
              this.store.dispatch(authLogout());
            }
          }),
          takeUntil(this.unsubscribe),
            finalize(() => {
              this.router.navigate(['/']);
              // this.cdr.markForCheck();
            })
          ).subscribe();
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}

  processGoogleUserData(access_token: string): Observable<any> {
      return this.http.get<any>("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + access_token);
  }

  loginUser(data: any = {}): Observable<any> {
      return this.http.post<any>("https://martin.co.ke/mvg/api/signin", data, {});
  }

}
