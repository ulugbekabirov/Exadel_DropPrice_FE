import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ApiDataService } from '../../../services/api-data.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Tag } from '../../../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class SearchBar {
  constructor(
    public name: string,
    public tag: string[] = [],
  ) {}
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [ApiDataService]
})

export class SearchBarComponent implements OnInit, OnDestroy {
  
  rating3: number;
  public form: FormGroup

  public consoleMessages: string[] = [];
  public userQuestion: string;
  public userQuestionUpdate = new Subject<string>();
  public searches: SearchBar[] = [];
  public tagsName: string[] = [];
  private subscription: Subscription;

  @Input() tags: Tag[];
  @Output() searchQueryChange = new EventEmitter<any>();

  ngOnChanges(changes: any) {
    let tagsCurrenValue = changes.tags.currentValue;
    if (tagsCurrenValue && tagsCurrenValue.length) {
      console.log('dddd', tagsCurrenValue);
      setTimeout(()=> {
        let event = new Event("click");
        let first = document.querySelector('mat-chip');
        first.dispatchEvent(event);
      }, 0)
    } 
  }

  userNext(evt): void {
    return this.userQuestionUpdate.next(evt);
  }

  addSearch(): void {
    this.searches.pop();
    this.searches.push(new SearchBar(this.userQuestion, this.tagsName));
    this.searchQueryChange.emit(this.searches[0]);
  }

  getCardsByTag(tag: string, chip: any): void {
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
}
