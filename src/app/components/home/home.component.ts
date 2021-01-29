import { Component, OnInit } from '@angular/core';
import { DiscountsService } from '../../services/discounts.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private discountsService: DiscountsService,
  ) {
  }
  ngOnInit(): void {

  }
}
