import { MatToolbarModule } from '@angular/material/toolbar';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyUserRolesDirective } from '../directives/verify-user-roles.directive';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
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
import { SearchComponent } from './components/search/search.component';
import { TagsFilterComponent } from './components/tags-filter/tags-filter.component';


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
    SearchComponent,
    TagsFilterComponent,
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
    MatSnackBarModule,
    TranslateModule,
    MatTabsModule,
    AgmCoreModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,
    MatToolbarModule,
    MatCheckboxModule
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
    MatSnackBarModule,
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
    MatCheckboxModule,
    MatExpansionModule,
    LoadingSpinnerComponent,
  ],
  entryComponents: [MapComponent],
})
export class SharedModule {}
