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

  @Input() options;
  value;
  @Input() tags$;
  @Output() chipSelected = new EventEmitter();
  @Input() activeTags$;
  userAction = true;

  constructor(
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.activeTags$.pipe().subscribe(next => {
      this.value = next;
    });
  }

  ngAfterViewInit(): void {
    this.selectChips(this.value);
  }

  selectChips(value: Tag[]): void {
    this.userAction = false;
    this.chipList.chips.forEach((chip: MatChip) => chip.deselect());
    // const chipsToSelect = [];
    // const chipsToSelect = this.chipList.chips.filter((chip) => value.find((tag) => chip.value.tagId === tag.tagId));
    // chipsToSelect.forEach((chip) => chip.select());
    this.userAction = true;
  }

  toggleSelection(chip: MatChip): void {
    chip.toggleSelected();
  }

  uniqChip(value, tag: Tag) {
    if (!value.length) {
      return [tag];
    }
    return value.filter((opt: Tag) => opt.tagId !== tag.tagId);
  }

  changeSelectedTag(chip: MatChipSelectionChange, isUserSelect): void {
    const chipValue = chip.source.value;

    if (!isUserSelect) {
      this.chipSelected.emit(chipValue);
      return;
    }
    const uniq = this.uniqChip(this.value, chipValue);
    if (chip.selected) {
      this.value = [...this.value, chipValue];
    } else {
      this.value = [...uniq];
    }
    console.log(this.chipList.chips);
    this.chipSelected.emit(this.value);
  }
}
