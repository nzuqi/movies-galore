import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  show: any = {};
  loading = true;
  error: any;
  _id: number = undefined;
  episodes: any[] = [];
  cast: any[] = [];
  crew: any[] = [];
  seasonsPanel: any[] = [];

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
    private router: Router
  ) {}

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
}
