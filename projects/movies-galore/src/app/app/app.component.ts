import browser from 'browser-detect';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment as env, environment } from '../../environments/environment';

import {
  authLogin,
  authLogout,
  routeAnimations,
  LocalStorageService,
  selectIsAuthenticated,
  selectSettingsStickyHeader,
  selectSettingsLanguage,
  selectEffectiveTheme
} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage,
  actionSettingsChangeTheme
} from '../core/settings/settings.actions';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = '../../assets/logo_full.png';
  logo_sm = '../../assets/logo.png';
  languages = ['en', 'sw'];
  themes = [
    { value: 'DEFAULT-THEME', label: 'blue' },
    { value: 'LIGHT-THEME', label: 'light' },
    // { value: 'NATURE-THEME', label: 'nature' },
    { value: 'BLACK-THEME', label: 'dark' }
  ];
  navigation = [
    { link: '', label: 'app.movies.search' },
    { link: 'movies/library', label: 'app.movies' }
    // { link: 'about', label: 'app.about' }
  ];
  navigationSideMenu = [
    ...this.navigation
    // { link: 'settings', label: 'app.menu.settings' }
  ];

  isAuthenticated$: Observable<boolean>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;

  constructor(
    private store: Store,
    private storageService: LocalStorageService,
    private http: HttpClient,
  ) {}

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
  }

  // onLoginClick() {
  //   this.store.dispatch(authLogin());
  // }

  checkSession(): Observable<any> {
    let data: any = {
      api_key: "vjlMG5wDfeiiHjaZV8Oq97MIrCkkVVZb2",
      data: {
        session_token: '',
        user_id: ''
      },
      id: 7719
    }
    return this.http.post<any>("https://martin.co.ke/mvg/api/check_session_token", data, {});
  }

  onLogoutClick() {
    this.store.dispatch(authLogout());
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }

  onThemeSelect({ value: theme }) {
    this.store.dispatch(actionSettingsChangeTheme({ theme }));
  }

  googleLogin() {
		var uri = `
			https://accounts.google.com/o/oauth2/auth?
			client_id=` + environment.google.client_id + `
			&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email
			&immediate=false
			&response_type=token
			&redirect_uri=http://localhost:4200/login
    `;
    //https://moviesgalore.web.app/login
		window.location.href = uri;
  }
  
}
