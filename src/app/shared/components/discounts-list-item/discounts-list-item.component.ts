import { ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { Discount } from '../../../models';
import { RefDirective } from '../../../directives/ref.directive';
import { TicketComponent } from '../../../components/ticket/ticket.component';
import { DiscountsService } from '../../../services/discounts.service';

@Component({
  selector: 'app-discounts-list-item',
  templateUrl: './discounts-list-item.component.html',
  styleUrls: ['./discounts-list-item.component.scss']
})
export class DiscountsListItemComponent implements OnInit {
  discountId;
  @Input() discount: Discount;
  @Output() requestTicket = new EventEmitter<any>();
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private resolver: ComponentFactoryResolver,
    private discountsService: DiscountsService,
  ) {
  }

  ngOnInit(): void {
    this.discountId = this.discount.discountId;
  }

  ticketHandler(): void {
    // this.requestTicket.emit(this.discountId);
    const componentFactory = this.resolver.resolveComponentFactory(TicketComponent);
    this.refDir.containerRef.clear();
    const component = this.refDir.containerRef.createComponent(componentFactory);
    this.discountsService.getTicket(this.discountId)
      .subscribe(ticket => {
        console.log('ticket', ticket);
        component.instance.ticket = ticket;
      });

    // component.instance.ticket$ = this.discountsService.getTicket(this.discountId);
    component.instance.closeTicket.subscribe(() => {
      this.refDir.containerRef.clear();
    });
  }
}
