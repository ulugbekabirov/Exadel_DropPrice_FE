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
import { FormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AuthInterceptor } from './auth/auth.interceptor';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { HttpErrorInterceptor } from './services/http.error.interceptor';


import { MissingTranslationService } from './login-service/missing-translation.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { routing } from './app.routing';
import { NotFoundComponent } from './not-found/not-found.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}
@NgModule({
  declarations: [AppComponent, LoginFormComponent, HomeComponent, NotFoundComponent,HeaderComponent],

  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    SharedModule,
    routing,
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
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap:[AppComponent]
})
export class AppModule {}
