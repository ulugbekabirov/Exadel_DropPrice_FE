import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ApiDataService } from '../../../services/api-data.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HomeComponent } from '../../../components/home/home.component'


export class SearchBar{
  constructor(
    public name: string,
    public tag: string[] = [],
)
  {}
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [ApiDataService]
})

export class SearchBarComponent implements OnInit, OnDestroy {

  constructor(private apiDataService: ApiDataService) {}

  public consoleMessages: string[] = [];
  public userQuestion: string;
  public userQuestionUpdate = new Subject<string>();
  public searchs: SearchBar[] = [];
  public tagsName: string[] = [];
  private subscription: Subscription;

  @Input()
  tags;
  @Output()
  searchQuery = new EventEmitter<any>();

  userNext(evt): void {
    return this.userQuestionUpdate.next(evt)
  }

  addSearch(): void{
    this.searchs.pop();

    this.searchs.push(new SearchBar(this.userQuestion, this.tagsName));
    this.searchQuery.emit(this.searchs[0]);
    console.log(this.searchs);
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
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.consoleMessages.pop();
        this.consoleMessages.push(value);
        this.addSearch();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
