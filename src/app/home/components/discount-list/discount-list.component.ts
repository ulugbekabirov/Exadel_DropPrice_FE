import { Component, OnInit } from '@angular/core';
import { ApiDataService } from 'src/app/services/api-data.service';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.scss']
})
export class DiscountListComponent implements OnInit {
  fakeDiscounts = [
    {
      id : 1,
      discount : 30,
      discount_name: "Велотренажер",
      vendor_name : "Sport_master",
      distanse : 100,
      date : new Date().toLocaleDateString(),
      rating : 4
    },
    {
      id : 2,
      discount : 50,
      discount_name: "ice cream",
      vendor_name : "Ice_master",
      distanse : 200,
      date : new Date().toLocaleDateString(),
      rating : 4
    },
    {
      id : 3,
      discount : 30,
      discount_name: "Dream",
      vendor_name : "Dream_master",
      distanse : 300,
      date : new Date().toLocaleDateString(),
      rating : 4
    },
    {
      id : 4,
      discount : 60,
      discount_name: "Rick",
      vendor_name : "Neutrino_bomb",
      distanse : 111300,
      date : new Date().toLocaleDateString(),
      rating : 4
    }
  ]
  constructor(private apiData: ApiDataService) { }

  ngOnInit(): void {
  }

}
