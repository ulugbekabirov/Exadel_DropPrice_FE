import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth/services/auth.service';
import { AuthInfo } from './models';
import { LanguageService } from './services/language.service';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from './services/loading.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authUser: AuthInfo;
  private subscription: Subscription;
  public title = 'InternshipFe';
  loading$: Observable<boolean>;


  constructor(
    private translateService: TranslateService,
    private auth: AuthService,
    private languageService: LanguageService,
    private loadingService: LoadingService
  ) {
    this.subscription = this.auth.authUser.subscribe(user => this.authUser = user);
  }

  ngOnInit(): void {
    this.languageService.select('activeLanguage')
      .subscribe((next: string) => this.translateService.use(next));
    this.loading$ = this.loadingService.isLoading$.pipe(
      delay(0)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
