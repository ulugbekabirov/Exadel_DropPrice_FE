import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
  
  @Input() discountObj;

  constructor() { }

  ngOnInit(): void {
  }

  talonHandler(){
    console.log('d',this.discountObj);
    alert('haven\'t done yet'); //...
  }

}
