import { Component, ViewEncapsulation} from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { AuthInfo } from '../../models';
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class HeaderComponent {
  languages$;
  activeLanguage$;
  authUser$: Observable<AuthInfo> = this.auth.authUser;
  active: boolean;

  constructor(
    private languageService: LanguageService,
    private auth: AuthService
  ) {
    this.languages$ = this.languageService.select('languages');
    this.activeLanguage$ = this.languageService.select('activeLanguage');
  }

  languageHandler(language: string): void {
    this.languageService.set('activeLanguage', language);
  }

  logoutHandler(): void {
    this.toggleActive();
    this.auth.logout();
  }

  toggleActive(): boolean {
    return this.active = !this.active;
  }
}
