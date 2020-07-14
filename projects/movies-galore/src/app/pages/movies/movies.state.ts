import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { AppState } from '../../core/core.module';

export const FEATURE_NAME = 'movies';
export const selectMovies = createFeatureSelector<State, MoviesState>(
  FEATURE_NAME
);
export const reducers: ActionReducerMap<MoviesState> = {
  // todos: todosReducer,
  // stocks: stockMarketReducer,
  // books: bookReducer,
  // form: formReducer
};

export interface MoviesState {
  // todos: TodosState;
  // stocks: StockMarketState;
  // form: FormState;
  // books: BookState;
}

export interface State extends AppState {
  movies: MoviesState;
}
