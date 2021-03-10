import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { finalize, mapTo, scan, switchMap, takeWhile, tap } from 'rxjs/operators';

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
export class CountdownTimerComponent implements OnInit {
  @Input() editSession$;
  @Input() editSession;
  @Output() counterRefresh: EventEmitter<any> = new EventEmitter();
  countDown$;
  counter: number;
  tick = 1000;
  startTimer$ = new BehaviorSubject(false);

  @ViewChild('reset', {static: true})
  refreshBtn: ElementRef;

  ngOnInit(): void {
    this.countDown$ = this.startTimer$.pipe(
      switchMap((session) => {
        return interval(this.tick)
          .pipe(
            mapTo(-1),
            scan((acc, curr) => (curr ? curr + acc : acc), this.editSession),
            takeWhile(count => count >= 0),
            tap(next => console.log(next)),
            finalize(() => this.counterRefresh.emit(false))
          );
      }),
    );
  }

  refreshSession($event: MouseEvent): void {
    this.counterRefresh.emit(true);
  }
}
