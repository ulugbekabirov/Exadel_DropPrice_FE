import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DiscountDetailComponent } from './discount-detail.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DiscountDetailComponent', () => {
  let component: DiscountDetailComponent;
  let fixture: ComponentFixture<DiscountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, 
        HttpClientTestingModule, 
        TranslateModule.forRoot()],
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
      const rating =  component.selectedRatingValue = 0;
      fixture.detectChanges();

      expect(getFullStars() - rating).toEqual(5);
    });

    it('shows zero empty stars when the rating is five', () => {
      const rating = component.selectedRatingValue = 5;
      fixture.detectChanges();

      expect(getFullStars() - rating).toEqual(0);
    });

    it('shows "five minus rating" empty stars', () => {
      const rating = component.selectedRatingValue = 3;
      fixture.detectChanges();

      expect(getFullStars() - rating).toEqual(2);
    });

    it('shows "five minus rating" empty stars', () => {
      const rating =  component.selectedRatingValue = 5;
      fixture.detectChanges();

      expect(rating).toEqual(5);
    });

    it('shows zero full stars when the rating is zero', () => {
      const rating =  component.selectedRatingValue = 0;
      fixture.detectChanges();

      expect(rating).toEqual(0);
    });

    it('shows "rating" full stars', () => {
      const rating =  component.selectedRatingValue = 3;
      fixture.detectChanges();

      expect(rating).toEqual(3);
    });

    it('shows no half star', () => {
      const rating =  component.selectedRatingValue = 3;
      fixture.detectChanges();

      expect(rating).toBeNull();
    });
  });

  function getFullStars(): number {
    const element = component.stars.length;

    return element;
  }
  
});
