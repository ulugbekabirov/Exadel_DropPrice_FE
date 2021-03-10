import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatChipList } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/operators';
import { Tag } from '../../../models';

@Component({
  selector: 'app-tags-filter',
  templateUrl: './tags-filter.component.html',
  styleUrls: ['./tags-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TagsFilterComponent implements OnInit {

  @ViewChild(MatChipList) chipList: MatChipList;
  @Input() tags$;
  privateTags$;
  @Output() chipSelected = new EventEmitter();
  @Input() activeTags$;
  selectedTags: Tag[] = [];

  ngOnInit(): void {
    this.privateTags$ = this.activeTags$.pipe(
      switchMap((activeTags: Tag[]): Observable<Tag[]> => {
        this.selectedTags = activeTags;
        return this.tags$.pipe(
          map((tags: Tag[]): Tag[] => tags.map((tag: Tag) => {
            const find = activeTags.find((activeTag: Tag) => tag.tagId === activeTag.tagId);
            if (find) {
              return { ...tag, selected: true };
            } else {
              return { ...tag, selected: false };
            }
          }))
        );
      })
    );
  }

  toggleSelection(chip): void {
    if (this.selectedTags.find(tag => tag.tagId === chip.tagId)) {
      this.selectedTags = this.selectedTags.filter(tag => chip.tagId !== tag.tagId);
    } else {
      this.selectedTags = [...this.selectedTags, chip];
    }
    this.chipSelected.emit(this.selectedTags);
  }
}
