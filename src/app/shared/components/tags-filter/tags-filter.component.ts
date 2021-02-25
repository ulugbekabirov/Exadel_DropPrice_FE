import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatChip, MatChipList, MatChipSelectionChange } from '@angular/material/chips';
import { Tag } from '../../../models';

@Component({
  selector: 'app-tags-filter',
  templateUrl: './tags-filter.component.html',
  styleUrls: ['./tags-filter.component.scss'],
})

export class TagsFilterComponent implements OnInit, AfterViewInit {

  @ViewChild(MatChipList) chipList: MatChipList;
  @Input() tags$;
  @Output() chipSelected = new EventEmitter();
  @Input() activeTags$;
  selectedTags: Tag[];
  userAction = true;

  constructor(
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.activeTags$.pipe().subscribe(next => {
      this.selectedTags = next;
    });
  }

  ngAfterViewInit(): void {
    this.selectChips(this.selectedTags);
  }

  selectChips(value: Tag[]): void {
    this.userAction = false;
    this.chipList.chips.forEach((chip: MatChip) => chip.deselect());
    // const chipsToSelect = [];
    const chipsToSelect = this.chipList.chips
      .filter((chip) => {
        const find = value.find(tag => tag.tagId === chip.value.tagId);
        console.log(find);
        if (find) {
          return true;
        }
      });
    console.log(chipsToSelect);
    chipsToSelect.forEach((chip) => chip.select());
    this.userAction = true;
  }

  uniqChip(tag: Tag): any {
    if (!this.selectedTags.length) {
      return [tag];
    }
    return this.selectedTags.filter((opt: Tag) => opt.tagId !== tag.tagId);
  }

  changeSelectedTag(chip: MatChipSelectionChange, isUserSelect): void {

    const chipValue = chip.source.value;

    if (!isUserSelect) {
      this.chipSelected.emit(chipValue);
      return;
    }
    const uniq = this.uniqChip( chipValue);
    if (chip.selected) {
      this.selectedTags = [...this.selectedTags, chipValue];
    } else {
      this.selectedTags = [...uniq];
    }
    console.log(this.chipList.chips);
    this.chipSelected.emit(this.selectedTags);
  }

  toggleSelection(chip): void {
    chip.toggleSelected();
  }

}
