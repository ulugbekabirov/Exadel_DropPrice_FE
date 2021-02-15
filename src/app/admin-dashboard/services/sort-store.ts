import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map,} from 'rxjs/operators';

export interface SortItem<T> {
  value: T;
  text: string;
}

export interface SearchState<T> {
  data: SortItem<T>[];
  selected: string[];
}

type RatingSortState = SearchState<string>;
type TicketCountSortState = SearchState<string>;
type SearchQueryState = string;
type TakeState = number;
type SkipState = number;

const SEARCH_INITIAL_STATE = {
  rating: {
    data: ['RatingAsc', 'RatingDesc'],
    selected: 'RatingDesc'
  },
  ticketCount: {
    data: ['TicketCountAsc', 'TicketCountDesc'],
    selected: 'TicketCountAsc',
  },
  searchQuery: '',
  skip: 0,
  take: 10,
};

export class BehaviorSubjectItem<T> {
  readonly subject: BehaviorSubject<T>;
  readonly value$: Observable<T>;

  get value(): T {
    return this.subject.value;
  }

  set value(value: T) {
    this.subject.next(value);
  }

  constructor(initialValue: T) {
    this.subject = new BehaviorSubject(initialValue);
    this.value$ = this.subject.asObservable();
  }
}

@Injectable({
  providedIn: 'root'
})

export class SortStore {
  constructor() {
  }

  sortsState: BehaviorSubjectItem<SearchState> = new BehaviorSubjectItem(SEARCH_INITIAL_STATE);

  sortRating$: Observable<RatingSortState> = this.sortsState.value$.pipe(
    map(searchState => searchState.rating)
  );

  sortTicket$: Observable<TicketCountSortState> = this.sortsState.value$.pipe(
    map(searchState => searchState.ticketCount)
  );

  sortRatingData$: Observable<SortItem<string>[]> = this.sortRating$.pipe(
    map(ratingSort => ratingSort.data),
  );

  sortRatingSelected$: Observable<string[]> = this.sortRating$.pipe(
    map(ratingSort => ratingSort.selected),
  );

  sortTicketCountData$: Observable<SortItem<string>[]> = this.sortTicket$.pipe(
    map(ticketCountSort => ticketCountSort.data),
  );

  sortTicketCountSelected$: Observable<string[]> = this.sortTicket$.pipe(
    map(ticketCountSort => ticketCountSort.selected),
  );

  searchQuery$: Observable<SearchQueryState> = this.sortsState.value$.pipe(
    map(searchState => searchState.searchQuery)
  );

  take$: Observable<TakeState> = this.sortsState.value$.pipe(
    map(searchState => searchState.take)
  );

  skip$: Observable<SkipState> = this.sortsState.value$.pipe(
    map(searchState => searchState.skip)
  );

  setRatingData(data: SortItem<string>[]): void {
    const oldState = this.sortsState.value;
    this.sortsState.value = {
      ...oldState,
      rating: {
        ...oldState.rating,
        data,
      },
    };
  }

  setRatingSelected(selected: string): void {
    const oldState = this.sortsState.value;
    this.sortsState.value = {
      ...oldState,
      rating: {
        ...oldState.rating,
        selected,
      },
    };
    console.log(this.sortsState.value);
  }

  setTicketCountData(data: SortItem<string>[]): void {
    const oldState = this.sortsState.value;
    this.sortsState.value = {
      ...oldState,
      ticketCount: {
        ...oldState.ticketCount,
        data,
      },
    };
  }

  setTicketCountSelected(selected: string): void {
    const oldState = this.sortsState.value;
    this.sortsState.value = {
      ...oldState,
      ticketCount: {
        ...oldState.ticketCount,
        selected,
      },
    };
    console.log(this.sortsState.value);
  }

  setSearchQuery(query: string): void {
    const oldState = this.sortsState.value;
    this.sortsState.value = {
      ...oldState,
      searchQuery: query
    };
    console.log(this.sortsState.value);
  }

  setTake(query: number): void {
    const oldState = this.sortsState.value;
    this.sortsState.value = {
      ...oldState,
      take: query
    };
    console.log(this.sortsState.value);
  }

  setSkip(query: number): void {
    const oldState = this.sortsState.value;
    this.sortsState.value = {
      ...oldState,
      skip: query
    };
    console.log(this.sortsState.value);
  }

}
