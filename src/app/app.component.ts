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


export class AppComponent implements OnInit{
  title = 'InternshipFe';
  private activeUser: AuthInfo;
   ngOnInit(): void {
      this.translateService.use(environment.defaultLocale);
   }
  constructor(private translateService: TranslateService,private auth: AuthService) {
    this.auth.activeUser.subscribe(user => this.activeUser = user);
  }
}
