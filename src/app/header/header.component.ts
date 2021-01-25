import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent implements OnInit{
  public langs:string[] = environment.locales;
  defaultLang:string = localStorage.getItem('currentlang') ?? environment.defaultLocale;
  
  constructor(public translateService: TranslateService,private auth: AuthService) {}
  languageHandler(selectedLang:string){
    this.translateService.use(selectedLang);
  }
  logoutHandler(){
    this.auth.logout();
  }
  
  ngOnInit(){
  
  }
}
