import { environment } from './../environments/environment';
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
import { HttpErrorInterceptor } from './services/http.error.interceptor';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MissingTranslationService } from './services/missing-translation.service';
import { HeaderComponent } from './components/header/header.component';
import { AppRoutingModule } from './app-routing/app.routing.module';
import { NewDiscountComponent } from './components/new-discount/new-discount.component';
import { ModeratorDashboardComponent } from './components/moderator-dashboard/moderator-dashboard.component';
import { NewVendorComponent } from './components/new-vendor/new-vendor.component';
import { MapComponent } from './components/map/map.component';
import { DiscountDetailComponent } from './components/discount-detail/discount-detail.component';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { LoadingInterceptor } from './services/loading.interceptor';

export function HttpLoaderFactory(http: HttpClient): any {
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
    DiscountDetailComponent,
    DiscountsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
