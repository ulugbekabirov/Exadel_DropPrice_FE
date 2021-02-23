import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountDetailComponent } from './discount-detail.component';

describe('DiscountDetailComponent', () => {
  let component: DiscountDetailComponent;
  let fixture: ComponentFixture<DiscountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the rating has no remainder', () => {
    it('shows five empty stars when the rating is zero', () => {
      component.selectedRatingValue = 0;
      fixture.detectChanges();

      expect(5 - getFullStars()).toEqual(5);
    });

    it('shows zero empty stars when the rating is five', () => {
      component.selectedRatingValue = 5;
      fixture.detectChanges();

      expect(5 - getFullStars()).toEqual(0);
    });

    it('shows "five minus rating" empty stars', () => {
      component.selectedRatingValue = 3;
      fixture.detectChanges();

      expect(5 - getFullStars()).toEqual(2);
    });

    it('shows "five minus rating" empty stars', () => {
      component.selectedRatingValue = 5;
      fixture.detectChanges();

      expect(getFullStars()).toEqual(5);
    });

    it('shows zero full stars when the rating is zero', () => {
      component.selectedRatingValue = 0;
      fixture.detectChanges();

      expect(getFullStars()).toEqual(0);
    });

    it('shows "rating" full stars', () => {
      component.selectedRatingValue = 3;
      fixture.detectChanges();

      expect(getFullStars()).toEqual(3);
    });

    it('shows no half star', () => {
      component.selectedRatingValue = 3;
      fixture.detectChanges();

      expect(getFullStars()).toBeNull();
    });
  });

  function getFullStars(): number {
    const  full = fixture.nativeElement.querySelectorAll('ul.discount-detail__rating_list > li.selected').length;
    return full;
  }
});
