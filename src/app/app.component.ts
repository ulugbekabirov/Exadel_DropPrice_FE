import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth/auth.service';
import { AuthInfo } from './models';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private activeUser: AuthInfo;
  title = 'InternshipFe';

  constructor(
     private translateService: TranslateService,
     private auth: AuthService,
     private langService: LanguageService
  ) {
    this.auth.activeUser.subscribe(user => this.activeUser = user);
  }

  ngOnInit(): void {
    this.translateService.use(this.langService.getCurrentLang());
  }

}
