import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';
import { of } from 'rxjs/internal/observable/of';
import { By } from '@angular/platform-browser';

describe('SearchBarComponent (deep tests)', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  const mockTagsService = jasmine.createSpyObj(['getTags']);

  let TAGS;

  beforeEach(async () => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    TAGS = [
      { id: 1, Tagsname: 'Спорт'},
      { id: 2, Tagsname: 'Суши' },
      { id: 3, Tagsname: 'Ролики'}
    ];

    await TestBed.configureTestingModule({
      declarations: [ SearchBarComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SearchBarComponent);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  it('should render each Chips as a SearchBarComponent', () => {
    mockTagsService.getTags.and.returnValue(of(TAGS));

    fixture.detectChanges();

    const SearchBarComponentDEs = fixture.debugElement.queryAll(By.directive(SearchBarComponent));
    expect(SearchBarComponentDEs.length).toEqual(3);
    for (let i = 0; i < SearchBarComponentDEs.length; i++) {
      expect(SearchBarComponentDEs[i].componentInstance).toEqual(TAGS[i]);
    }
  });
});

