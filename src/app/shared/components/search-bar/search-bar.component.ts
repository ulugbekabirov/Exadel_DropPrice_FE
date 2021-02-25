import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Tag } from '../../../models';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  options;
  value;
  // chipsControl: FormArray = this.fb.array([]);

  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,

  ) {
  }

  ngOnInit(): void {
    // this.subscription = this.activeTags$.pipe(
    //   take(1),
    //   switchMap((result: Tag[]) => {
    //     this.value = result;
    //     result.forEach(ch => {
    //       const chip = this.fb.group({
    //         tagName: '',
    //         tagId: ''
    //       });
    //       this.chipsControl.push(chip);
    //     });
    //     this.chipsControl.setValue(result);
    //     return this.chipsControl.valueChanges;
    //   })
    // ).subscribe(next => {
    //   this.searchTagChange(next);
    // });
  }

  searchTagChange(tag): void {
    this.onEmitSearchTag.emit(tag);
  }

  searchTermChange(searchTerm: string): void {
    this.onEmitSearchTerm.emit(searchTerm);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
