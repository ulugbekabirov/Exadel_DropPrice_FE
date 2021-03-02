import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input()
  countMinutes: number;
  countDown$;
  counter: number;
  tick = 1000;

  ngOnInit(): void {
    console.log(this.countMinutes);
    this.counter = 60 * this.countMinutes;
    this.countDown$ = timer(0, this.tick).pipe(
      take(this.counter),
      map(() => --this.counter),
      tap(next => console.log(next))
    );
  }

  ngOnDestroy(): void {
  }
}
