import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  searchTerm: FormControl = new FormControl();
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
    return source$.pipe(debounceTime(800), distinctUntilChanged());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
