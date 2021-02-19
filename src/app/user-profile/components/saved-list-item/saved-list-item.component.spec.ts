import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedListItemComponent } from './saved-list-item.component';

describe('SavedListItemComponent', () => {
  let component: SavedListItemComponent;
  let fixture: ComponentFixture<SavedListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedListItemComponent ]
    })
    .compileComponents();
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
