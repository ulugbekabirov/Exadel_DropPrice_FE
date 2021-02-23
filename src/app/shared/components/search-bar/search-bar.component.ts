import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { MatChip, MatChipList } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Tag } from '../../../models';
import { ControlValueAccessor, FormGroup } from '@angular/forms';

export class SearchBar {
  constructor(
    public name: string,
    public tag: string[] = [],
  ) {
  }
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})

export class SearchBarComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
  public form: FormGroup;
  public consoleMessages: string[] = [];
  public userQuestion: string;
  public userQuestionUpdate = new Subject<string>();
  public searches: SearchBar[] = [];
  public tagsName: string[] = [];
  private subscription: Subscription;

  value: string[] = [];

  onChange!: (value: string[]) => void;
  onTouch: any;
  disabled = false;



  @Input() activeTags$;
  @Input() tags$: Observable<Tag[]>;
  @Input() searchTerm$: Observable<string>;
  @Output() searchQueryChange = new EventEmitter<any>();
  @ViewChild(MatChipList)
  chipList!: MatChipList;

  userNext(evt): void {
    return this.userQuestionUpdate.next(evt);
  }

  addSearch(): void {
    this.searches.pop();
    this.searches.push(new SearchBar(this.userQuestion, this.tagsName));
    this.searchQueryChange.emit(this.searches[0]);
  }

  getCardsByTag(tag: string, chip: any): void {
    console.log(chip);
    console.log(tag);
    chip.toggleSelected();
    if (this.tagsName.indexOf(tag) > -1) {
      this.tagsName.splice(this.tagsName.indexOf(tag), 1);
    } else {
      this.tagsName.push(tag);
    }
    this.addSearch();
  }


  ngOnInit(): void {
    this.subscription = this.userQuestionUpdate.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(value => {
        this.consoleMessages.pop();
        this.consoleMessages.push(value);
        this.addSearch();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  propagateChange(value: string[]) {
    if (this.onChange) {
      this.onChange(value);
    }
  }

  writeValue(value: string[]): void {
    // When form value set when chips list initialized
    if (this.chipList && value) {
      this.selectChips(value);
    } else if (value) {
      // When chips not initialized
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  ngAfterViewInit() {
    this.selectChips(this.value);

    this.chipList.chipSelectionChanges
      .pipe(
        untilDestroyed(this),
        map((event) => event.source)
      )
      .subscribe((chip) => {
        if (chip.selected) {
          this.value = [...this.value, chip.value];
        } else {
          this.value = this.value.filter((o) => o !== chip.value);
        }

        this.propagateChange(this.value);
      });
  }

  selectChips(value: string[]): void {
    this.chipList.chips.forEach((chip) => chip.deselect());

    const chipsToSelect = this.chipList.chips.filter((c) =>
      value.includes(c.value)
    );

    chipsToSelect.forEach((chip) => chip.select());
  }

  toggleSelection(chips: MatChip): void {
    chips.toggleSelected();
  }
}
