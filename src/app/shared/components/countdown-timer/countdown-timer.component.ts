import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges
} from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { mapTo, scan, switchMap, takeWhile, tap } from 'rxjs/operators';

interface EditSession {
  message: string;
  editTime: number;
  isEditedDiscount: boolean;
  discountArchive: boolean;
}

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownTimerComponent implements OnChanges {
  @Input() editSession: EditSession;
  @Output() counterRefresh: EventEmitter<any> = new EventEmitter();
  countDown$: Observable<number>;
  tick = 1000;

  @ViewChild('reset', {static: true})
  refreshBtn: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editSession.currentValue) {
      this.countDown$ = of(changes.editSession.currentValue).pipe(
        switchMap(({editTime}) => {
          return interval(this.tick)
            .pipe(
              mapTo(-1),
              scan((acc, curr) => (curr ? curr + acc : acc), editTime),
              takeWhile(count => count >= 0),
              tap(count => {
                if (count === 0) {
                  this.counterRefresh.emit(false);
                }
              })
            );
        }),
      );
    }
  }

  refreshSession($event: MouseEvent): void {
    this.counterRefresh.emit(true);
  }
}
