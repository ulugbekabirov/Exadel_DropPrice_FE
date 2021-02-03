import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { Discount } from '../../../models';

@Component({
  selector: 'app-discounts-list-item',
  templateUrl: './discounts-list-item.component.html',
  styleUrls: ['./discounts-list-item.component.scss']
})
export class DiscountsListItemComponent  {

  staticHeartLink = '/assets/img/heart.png';
  favoriteHeartLink = '/assets/img/favorite.png';
  currentHeartStatus: string = this.staticHeartLink;
  @Input() discount: Discount;

  addToFavorites(): void {
    if (this.currentHeartStatus === this.staticHeartLink) {
      this.currentHeartStatus = this.favoriteHeartLink;
    } else {
      this.currentHeartStatus = this.staticHeartLink;
    }
  }

  talonHandler(): void {
    alert('haven\'t done yet'); // ...
  }
}
