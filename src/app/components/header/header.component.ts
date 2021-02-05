import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { AuthInfo } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent {
  public langs: string[] = environment.locales;
  defaultLang: string = localStorage.getItem('currentLang') ?? environment.defaultLocale;
  authUser$: Observable<AuthInfo> = this.auth.authUser;
  active: boolean;

  constructor(
    public translateService: TranslateService,
    private auth: AuthService) {
  }

  languageHandler(selectedLang: string): void {
    localStorage.setItem('currentLang', selectedLang);
    this.translateService.use(selectedLang);
  }

  logoutHandler(): void {
    this.auth.logout();
  }

  toggleActive(): boolean {
    return this.active = !this.active;
  }
}
