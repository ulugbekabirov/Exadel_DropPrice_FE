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
import { AppRoutingModule } from './app-routing/app.routing.module';
import { ModeratorModule } from './moderator/moderator.module';
import { StatisticsModule } from './statistics/statistics.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MissingTranslationService } from './services/missing-translation.service';
import { HeaderComponent } from './components/header/header.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { NewDiscountComponent } from './components/new-discount/new-discount.component';
import { NewVendorComponent } from './components/new-vendor/new-vendor.component';
import { MapComponent } from './components/map/map.component';
import { VendorDetailComponent } from './components/vendor-detail/vendor-detail.component';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HeaderComponent,
    TicketComponent,
    NewVendorComponent,
    MapComponent,
    VendorDetailComponent,
    NewDiscountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    // ModeratorModule,
    HomeModule,
    StatisticsModule,
    UserProfileModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
