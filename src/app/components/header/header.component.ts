import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { DiscountsFacadeService } from '../../home/services/discounts-facade.service';
import { AuthInfo } from '../../models';
import { Observable, Subject } from 'rxjs';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class HeaderComponent implements OnDestroy {
  languages$;
  activeLanguage$;
  authUser$: Observable<AuthInfo> = this.auth.authUser;
  active: boolean;
  private unsubscribe$ = new Subject<void>();


  constructor(
    private languageService: LanguageService,
    private auth: AuthService,
    private facade: DiscountsFacadeService
  ) {
    this.languages$ = this.languageService.select('languages');
    this.activeLanguage$ = this.languageService.select('activeLanguage');
  }

  languageHandler(language: string): void {
    this.languageService.set('activeLanguage', language);
    this.facade.getTowns()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  logoutHandler(): void {
    this.toggleActive();
    this.auth.logout();
  }

  toggleActive(): boolean {
    return this.active = !this.active;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
