import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../environments/environment';
import { AuthService } from './auth/auth.service';
import { AuthInfo } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'InternshipFe';
  private activeUser: AuthInfo;
  constructor(
    private auth: AuthService,
    private translateService: TranslateService
  ) {
    this.auth.activeUser.subscribe((user) => (this.activeUser = user));
  }

  ngOnInit(): void {
    this.translateService.use(environment.defaultLocale);
  }
}
