import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChip, MatChipList } from '@angular/material/chips';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tags-filter',
  templateUrl: './tags-filter.component.html',
  styleUrls: ['./tags-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TagsFilterComponent,
      multi: true,
    },
  ],
})

export class TagsFilterComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild(MatChipList)
  chipList!: MatChipList;

  @Input() options;
  @Input() tags$;

  value: string[] = [];
  onChange!: (value: string[]) => void;
  onTouch: any;

  constructor() {}

  writeValue(value: string[]): void {
    console.log(value);
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.selectChips(this.value);

    this.chipList.chipSelectionChanges
      .pipe(
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

  propagateChange(value: string[]): void {
    if (this.onChange) {
      this.onChange(value);
    }
  }

  selectChips(value: string[]): void {
    this.chipList.chips.forEach((chip: MatChip) => chip.deselect());

    const chipsToSelect = this.chipList.chips.filter((chip: MatChip) =>
      value.includes(chip.value)
    );

    chipsToSelect.forEach((chip) => chip.select());
  }

  toggleSelection(chip: MatChip): void {
    console.log(chip);
    chip.toggleSelected();
  }
}
