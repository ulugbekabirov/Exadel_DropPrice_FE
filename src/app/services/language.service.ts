import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public langs: string[] = environment.locales;
  public defaultLang: string = environment.defaultLocale;

  protected nameInLS = 'currentLang';

  getCurrentLang(): any {
    return localStorage.getItem(this.nameInLS) ?? this.defaultLang;
  }

  setLanguageTolS(selectedLang: string): void {
    localStorage.setItem(this.nameInLS, selectedLang);
  }

  removeLanguageFromLS(): void {
    localStorage.removeItem(this.nameInLS);
  }
}
