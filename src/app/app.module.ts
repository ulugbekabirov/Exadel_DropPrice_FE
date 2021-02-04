import { environment } from './../environments/environment.prod';
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
import { AgmCoreModule } from '@agm/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { HttpErrorInterceptor } from './services/http.error.interceptor';
import { MissingTranslationService } from './login-service/missing-translation.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app.routing.module';
import { ModeratorDashboardComponent } from './moderator-dashboard/moderator-dashboard.component';
import { NewVendorComponent } from './new-vendor/new-vendor.component';
import { MapComponent } from './map/map.component';
import { NewDiscountComponent } from './new-discount/new-discount.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomeComponent,
    HeaderComponent,
    ModeratorDashboardComponent,
    NewVendorComponent,
    MapComponent,
    NewDiscountComponent,
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
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApi,
    }),
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
