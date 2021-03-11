import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth/services/auth.service';
import { AuthInfo } from './models';
import { LanguageService } from './services/language/language.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { LoadingService } from './services/loading/loading.service';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authUser: AuthInfo;
  public title = 'InternshipFe';
  loading$: Observable<boolean>;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    private auth: AuthService,
    private languageService: LanguageService,
    private loadingService: LoadingService
  ) {
    this.auth.authUser.pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(user => this.authUser = user);
  }

  ngOnInit(): void {
    this.languageService.select('activeLanguage')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((next: string) => this.translateService.use(next));
    this.loading$ = this.loadingService.isLoading$.pipe(
      delay(0)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
