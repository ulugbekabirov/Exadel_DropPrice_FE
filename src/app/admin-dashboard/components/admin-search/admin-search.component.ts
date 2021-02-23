import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-search',
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss']
})
export class AdminSearchComponent implements OnInit, OnDestroy {
  searchTerm = new FormControl();
  @Output() onEmitSearchTerm: EventEmitter<string> = new EventEmitter();
  @Input() initialValue$: Observable<string>;
  subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.initialValue$.pipe(
      take(1),
      switchMap((result: string): Observable<string> => {
        this.searchTerm.patchValue(result);
        return this.throttle(this.searchTerm.valueChanges);
      })
    ).subscribe(next => this.onEmitSearchTerm.emit(next));
  }

  throttle(source$: Observable<string>): any {
    return source$.pipe(debounceTime(600), distinctUntilChanged());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
