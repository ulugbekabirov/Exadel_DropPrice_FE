import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { SearchFacade } from '../../services/search-facade';
import { SortStore } from '../../services/sort-store';
import { DiscountSortsStore } from '../../services/discount-sorts-store';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-search',
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss']
})
export class AdminSearchComponent implements OnInit {
  searchTerm = new FormControl();
  @Output() onEmitSearchTerm = new EventEmitter();
  @Input() initialValue;

  constructor() {
  }

  ngOnInit(): void {
    this.throttle(this.searchTerm.valueChanges).pipe(
    ).subscribe(next => this.onEmitSearchTerm.emit(next));
    this.initialValue.subscribe(next => {
        console.log('patch', next);
        this.searchTerm.patchValue(next)
      }
    );
  }

  throttle(source$: Observable<string>): any {
    return source$.pipe(debounceTime(350), distinctUntilChanged(), startWith(''));
  }
}
