import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
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
  }

  throttle(source$: Observable<string>): any {
    return source$.pipe(debounceTime(350), distinctUntilChanged(), startWith(''));
  }
}
