import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from '../../../models';

@Component({
  selector: 'app-orders-list-item',
  templateUrl: './orders-list-item.component.html',
  styleUrls: ['./orders-list-item.component.scss']
})
export class OrdersListItemComponent implements OnInit {
  @Input()
  ticket: Ticket;

  constructor() {
  }

  ngOnInit(): void {
  }

}
