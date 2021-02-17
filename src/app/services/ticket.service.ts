import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { TicketComponent } from '../shared/components/ticket/ticket.component';
import { ApiDataService } from './api-data.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private resolver: ComponentFactoryResolver,
    private restApi: ApiDataService,
  ) { }

  getTicket(discountId: number, ref): any {
    const ticketFactory = this.resolver.resolveComponentFactory(TicketComponent);
    ref.containerRef.clear();
    const component = ref.containerRef.createComponent(ticketFactory);
    component.instance.closeTicket.subscribe(() => {
      ref.containerRef.clear();
    });
    this.restApi.getTicket(discountId)
      .subscribe(ticket => {
        component.instance.ticket = ticket;
      });
    return component;
  }
}
