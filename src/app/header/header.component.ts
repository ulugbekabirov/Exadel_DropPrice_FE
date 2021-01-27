import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent {
  public langs:string[] = environment.locales;
  defaultLang:string = this.langServise.getCurrentLang();
  
  constructor(
    public translateService: TranslateService,
    private auth: AuthService,
    private langServise: LanguageService) {}

  languageHandler(selectedLang:string){
    this.langServise.setLanguageTolS(selectedLang);
    this.translateService.use(selectedLang);
  }
  logoutHandler(){
    this.auth.logout();
  }
}