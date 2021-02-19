import { MapComponent } from './../components/map/map.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyUserRolesDirective } from '../directives/verify-user-roles.directive';
import { NotFoundComponent } from './components/not-found.components/not-found.component';
import { RefDirective } from '../directives/ref.directive';
import { ModalComponent } from './components/modal.component/modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MetersToKilometersPipe } from '../pipes/meters-to-kilometers.pipe';
import { DiscountsListComponent } from './components/discounts-list/discounts-list.component';
import { DiscountsListItemComponent } from './components/discounts-list-item/discounts-list-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    VerifyUserRolesDirective,
    NotFoundComponent,
    RefDirective,
    ModalComponent,
    MetersToKilometersPipe,
    DiscountsListComponent,
    DiscountsListItemComponent,
    SearchBarComponent,
    TicketComponent,
    LoadingSpinnerComponent,
  ],

  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatCardModule,
    TranslateModule,
    MatTabsModule,
    AgmCoreModule,
    MatTooltipModule,
    MatDialogModule,
  ],

  providers: [GoogleMapsAPIWrapper],

  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    VerifyUserRolesDirective,
    NotFoundComponent,
    RefDirective,
    ModalComponent,
    MetersToKilometersPipe,
    DiscountsListComponent,
    DiscountsListItemComponent,
    SearchBarComponent,
    MatTooltipModule,
    MatDialogModule,
    LoadingSpinnerComponent,
  ],
  entryComponents: [MapComponent],
})
export class SharedModule {}
