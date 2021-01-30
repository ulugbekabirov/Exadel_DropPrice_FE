import { Component, OnInit, Input } from '@angular/core';
import { Discount } from '../../../../models';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  @Input() discountObj: Discount;

  staticHeartLink = '/assets/img/heart.png';
  favoriteHeartLink = '/assets/img/favorite.png';
  currentHeartStatus: string = this.staticHeartLink;

  constructor() { }

  ngOnInit(): void {
  }

  addToFavorites(){
    if (this.currentHeartStatus === this.staticHeartLink) {
      this.currentHeartStatus = this.favoriteHeartLink;
    }
    else { this.currentHeartStatus = this.staticHeartLink; }
  }
  talonHandler(){
    alert('haven\'t done yet'); // ...
  }

}
