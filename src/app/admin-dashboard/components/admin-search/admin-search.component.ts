import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-search',
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss']
})
export class AdminSearchComponent implements OnInit, OnDestroy {
  searchTerm = new FormControl();
  @Output() onEmitSearchTerm = new EventEmitter();
  @Input() initialValue;
  subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.throttle(this.searchTerm.valueChanges).pipe(
    ).subscribe(next => this.onEmitSearchTerm.emit(next));
  }

  throttle(source$: Observable<string>): any {
    return source$.pipe(debounceTime(350), distinctUntilChanged(), startWith(''));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
