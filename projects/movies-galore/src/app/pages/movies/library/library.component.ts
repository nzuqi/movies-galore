import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  shows: any[] = [];
  loading = true;
  error: any;
  search_query: string = '';
  current_page: number = 0;

  _shows = gql`
    query shows($pageId: Int, $searchQuery: String) {
      shows(pageId: $pageId, searchQuery: $searchQuery) {
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
      }
    }
  `;

  constructor(
    private apollo: Apollo,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {
    this._initLoading();
    this.search_query = this.activatedRoute.snapshot.queryParamMap.get('s');
  }

  ngOnInit(): void {
    // console.log(this.search_query);
    this._getData();
  }

  _initLoading() {
    this.loading = true;
    this.shows = [];
    for (let i = 0; i <= 11; i++) {
      this.shows.push({
        id: i,
        name: '',
        type: '',
        language: '',
        genres: '',
        url: '',
        status: '',
        premiered: '',
        officialSite: '',
        rating: undefined,
        image_medium: '',
        summary: '',
        updated: undefined
      });
    }
  }

  _getData() {
    this.apollo
      .watchQuery(
        this.search_query != '' && this.search_query != null
          ? {
              query: this._shows,
              variables: {
                searchQuery: this.search_query
              }
            }
          : {
              query: this._shows,
              variables: {
                pageId: this.current_page
              }
            }
      )
      .valueChanges.subscribe(result => {
        this.shows = result.data && result['data']['shows'];
        this.loading = result.loading;
        // console.log(this.shows);
        this.error = result['error'];
        this.cd.markForCheck();
      });
  }

  loadMore() {
    this._initLoading();
    this.current_page += 1;
    this._getData();
  }
}
