import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Tag } from '../../../models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})

export class SearchBarComponent implements OnInit, OnDestroy {

  @Output() onEmitSearchTerm: EventEmitter<string> = new EventEmitter();
  @Output() onEmitSearchTag: EventEmitter<string> = new EventEmitter();
  @Input() initialValue$: Observable<string>;
  @Input() activeTags$;
  @Input() tags$: Observable<Tag[]>;
  subscription: Subscription;
  // options = ['Clothing', 'Shoes', 'Electronics', 'Books', 'Magazines'];
  options;
  chipsControl = new FormControl(['']);

  ngOnInit(): void {
    this.tags$.pipe(
      map((next) => {
        console.log(next);
      }),
    ).subscribe(next => {
      console.log(next);
      this.options = next;
    });

    this.subscription = this.activeTags$.pipe(
      take(1),
      switchMap((result) => {
        this.chipsControl.setValue(result);
        return this.chipsControl.valueChanges;
      })
    ).subscribe(next => {
      console.log(next);
      this.searchTagChange(next);
    });
  }

  searchTagChange(tag): void {
    this.onEmitSearchTag.emit(tag);
  }

  searchTermChange(searchTerm: string): void {
    this.onEmitSearchTerm.emit(searchTerm);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
