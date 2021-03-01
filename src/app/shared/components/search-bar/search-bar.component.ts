import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../../../models';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchBarComponent {

  @Output() onEmitSearchTerm: EventEmitter<string> = new EventEmitter();
  @Output() onEmitSearchTag: EventEmitter<string> = new EventEmitter();
  @Input() initialValue$: Observable<string>;
  @Input() activeTags$: Observable<Tag[]>;
  @Input() tags$: Observable<Tag[]>;

  searchTagChange(tag): void {
    this.onEmitSearchTag.emit(tag);
  }

  searchTermChange(searchTerm: string): void {
    this.onEmitSearchTerm.emit(searchTerm);
  }

}
