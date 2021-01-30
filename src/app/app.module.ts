import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import {
  TranslateLoader,
  TranslateModule,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HttpErrorInterceptor } from './services/http.error.interceptor';
import { AppRoutingModule } from './app.routing.module';
import { LanguageService } from './services/language.service';
import { AppComponent } from './app.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { AuthService } from './auth/auth.service';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MissingTranslationService } from './services/missing-translation.service';
import { HeaderComponent } from './components/header/header.component';
import { DiscountComponent } from './components/home/components/discount/discount.component';
import { DiscountListComponent } from './components/home/components/discount-list/discount-list.component';
import { SearchTagComponent } from './components/home/components/search-tag/search-tag.component';
import { SearchBarComponent } from './components/home/components/search-bar/search-bar.component';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

@NgModule({
  declarations: [
    AppComponent, 
    LoginFormComponent, 
    HomeComponent,
    HeaderComponent,
    DiscountComponent, 
    TicketComponent,
    DiscountListComponent,
    SearchTagComponent,
    SearchBarComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationService,
      },
    }),
  ],
  providers: [
    LanguageService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap:[AppComponent]
})

export class AppModule {}
