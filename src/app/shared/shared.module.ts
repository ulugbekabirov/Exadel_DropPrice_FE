import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyUserRolesDirective } from '../directives/verify-user-roles.directive';
import { NotFoundComponent } from './components/not-found.components/not-found.component';
import { RefDirective } from '../directives/ref.directive';
import { ModalComponent } from './components/modal.component/modal.component';


@NgModule({
  declarations: [
    VerifyUserRolesDirective,
    NotFoundComponent,
    RefDirective,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatCardModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatCardModule,
    VerifyUserRolesDirective,
    NotFoundComponent,
    RefDirective,
    ModalComponent,
  ],
})
export class SharedModule {}
