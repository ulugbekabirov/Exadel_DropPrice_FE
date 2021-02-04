import { ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { Discount } from '../../../models';
import { RefDirective } from '../../../directives/ref.directive';
import { TicketComponent } from '../../../components/ticket/ticket.component';

@Component({
  selector: 'app-discounts-list-item',
  templateUrl: './discounts-list-item.component.html',
  styleUrls: ['./discounts-list-item.component.scss']
})
export class DiscountsListItemComponent {
  @Input() discount: Discount;
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;
  constructor(
    private resolver: ComponentFactoryResolver
  ) {
  }

  addToFavorites(): void {
  }

  ticketHandler(): void {
    const modalFactory = this.resolver.resolveComponentFactory(TicketComponent);
    this.refDir.containerRef.clear();
    const component = this.refDir.containerRef.createComponent(modalFactory);
    // component.instance.title = 'Ваше Местоположение';
    // component.instance.content = `longitude: ${this.position.latitude} longitude: ${this.position.longitude}`;
    // component.instance.content = this.position;
    component.instance.closeTicket.subscribe(() => {
      this.refDir.containerRef.clear();
    });
  }
}
