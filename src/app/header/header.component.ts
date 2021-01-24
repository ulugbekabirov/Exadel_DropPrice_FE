import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent implements OnInit{
  public langs:string[] = environment.locales;
  defaultLang:string = environment.defaultLocale;

  ngOnInit(): void {}
  constructor(public translateService: TranslateService) {}
  languageHandler(selectedLang:string){
    this.translateService.use(selectedLang);
  }
}
