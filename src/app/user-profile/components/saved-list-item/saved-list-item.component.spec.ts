import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedListItemComponent } from './saved-list-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


describe('SavedListItemComponent', () => {
  let component: SavedListItemComponent;
  let fixture: ComponentFixture<SavedListItemComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        MatSortModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        TranslateModule.forRoot()
        ],
      declarations: [ SavedListItemComponent],
      providers: [
        FormBuilder,
        Validators,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]

    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
