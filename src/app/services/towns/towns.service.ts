import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { Town } from '../../models';
import { ApiDataService } from '../api-data/api-data.service';


export interface TownsState {
  towns: Town[] | [];
}

const TOWNS_INITIAL_STATE: TownsState = {
  towns: [],
};

@Injectable({
  providedIn: 'root'
})
export class TownsService {
  private subject: BehaviorSubject<TownsState> = new BehaviorSubject<TownsState>(TOWNS_INITIAL_STATE);
  private store: Observable<TownsState> = this.subject.asObservable()
    .pipe(
      distinctUntilChanged()
    );

  constructor(
    private restApi: ApiDataService,
  ) {
  }

  getTowns(): Observable<any> {
    return this.restApi.getTowns();
  }

  get value(): any {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }

  set(name: string, state: any): void {
    this.subject.next({
      ...this.value,
      [name]: state
    });
  }
}
