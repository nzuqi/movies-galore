import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, NotificationService } from '../../../core/core.module';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  show: any = {};
  comment: any = {};
  towatch: any = {};
  favorite: any = {};
  loading = true;
  loadingComment = false;
  loadingToWatch = false;
  loadingFavorite = false;
  error: any;
  _id: number = undefined;
  episodes: any[] = [];
  cast: any[] = [];
  crew: any[] = [];
  seasonsPanel: any[] = [];

	private unsubscribe: Subject<any>;

  _show = gql`
    query show($showId: Int) {
      show(showId: $showId) {
        id
        name
        type
        language
        genres
        url
        status
        premiered
        officialSite
        rating
        image_medium
        summary
        updated
        episodes {
          id
          name
          season
          number
          airdate
          airtime
          airstamp
          runtime
          image_medium
          image_original
          summary
        }
        cast {
          id
          name
          country_name
          country_code
          birthday
          deathday
          gender
          image_medium
          image_original
        }
        crew {
          id
          name
          type
          country_name
          country_code
          birthday
          deathday
          gender
          image_medium
          image_original
        }
      }
    }
  `;

  constructor(
    private apollo: Apollo,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private notificationsService: NotificationService
  ) {
    this.unsubscribe = new Subject();
    // this.notificationsService.info("Message goes here");
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this._id = Number(params['id']);
        this.getData();
      } else {
        this.router.navigate(['/movies/library']);
      }
    });
  }

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

  getData() {
    this.apollo
      .watchQuery({
        query: this._show,
        variables: {
          showId: this._id
        }
      })
      .valueChanges.subscribe(result => {
        this.show = result.data && result['data']['show'];
        let _tempEpisodes = result.data && result['data']['show']['episodes'];

        // this.getMetaData(this.show.id);

        let _newObj = _tempEpisodes.reduce(function(r, a) {
          r[a.season] = r[a.season] || [];
          r[a.season].push(a);
          return r;
        }, Object.create(null));
        Object.keys(_newObj).forEach((key: string) => {
          this.episodes.push(_newObj[key]);
        });

        let _tempCast = result.data && result['data']['show']['cast'];
        const uniqueCast = _tempCast.filter((data, index) => {
          const _data = JSON.stringify(data);
          return (
            index ===
            _tempCast.findIndex(obj => {
              return JSON.stringify(obj) === _data;
            })
          );
        });
        this.cast = uniqueCast;

        let _tempCrew = result.data && result['data']['show']['crew'];
        const uniqueCrew = _tempCrew.filter((data, index) => {
          const _data = JSON.stringify(data);
          return (
            index ===
            _tempCrew.findIndex(obj => {
              return JSON.stringify(obj) === _data;
            })
          );
        });
        this.crew = uniqueCrew;

        this.loading = result.loading;
        // console.log(this.cast);
        this.error = result['error'];
        if (this.error) this.router.navigate(['/movies/library']);
        this.cd.markForCheck();
      });
  }

  favoriteShow(){
    console.log(this._id);
  }

  getMetaData(showId: number = 0) {
    this.loadingComment = true;
    this.loadingToWatch = true;
    this.loadingFavorite = true;
    this.commentsServerData(showId).pipe(tap(_resp => {
      // console.log(_resp);
      if(_resp['response_code'] == '200') {
        this.comment = _resp['data']['comments'][0];
      }
    }), takeUntil(this.unsubscribe), finalize(() => { this.loadingComment = false; this.cd.markForCheck(); })).subscribe();
    
    this.showsFavoritesData(showId).pipe(tap(_resp => {
      // console.log(_resp);
      if(_resp['response_code'] == '200') {
        this.favorite = _resp['data']['shows'][0];
      }
    }), takeUntil(this.unsubscribe), finalize(() => { this.loadingFavorite = false; this.cd.markForCheck(); })).subscribe();
    
    this.showsToWatchData(showId).pipe(tap(_resp => {
      // console.log(_resp);
      if(_resp['response_code'] == '200') {
        this.towatch = _resp['data']['shows'][0];
      }
    }), takeUntil(this.unsubscribe), finalize(() => { this.loadingToWatch = false; this.cd.markForCheck(); })).subscribe();
    
  }

  commentsServerData(showId: number = 0): Observable<any> {
    const _localData: any = JSON.parse(localStorage.getItem('mvgUser'));
    const _data = {
      user_id: _localData['id'],
      show_id: showId
    };
    return this.http.post<any>("https://martin.co.ke/mvg/api/get_comments", _data, {});
  }

  showsFavoritesData(showId: number = 0): Observable<any> {
    const _localData: any = JSON.parse(localStorage.getItem('mvgUser'));
    const _data = {
      user_id: _localData['id'],
      show_id: showId
    };
    return this.http.post<any>("https://martin.co.ke/mvg/api/get_favorites", _data, {});
  }

  showsToWatchData(showId: number = 0): Observable<any> {
    const _localData: any = JSON.parse(localStorage.getItem('mvgUser'));
    const _data = {
      user_id: _localData['id'],
      show_id: showId
    };
    return this.http.post<any>("https://martin.co.ke/mvg/api/get_to_watch", _data, {});
  }

}
