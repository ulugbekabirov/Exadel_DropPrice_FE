import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Ticket } from '../../models';
import { TicketComponent } from '../../shared/components/ticket/ticket.component';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private resolver: ComponentFactoryResolver,
  ) {
  }

  createTicket(ticket: Ticket, ref): any {
    const ticketFactory = this.resolver.resolveComponentFactory(TicketComponent);
    ref.containerRef.clear();
    const component = ref.containerRef.createComponent(ticketFactory);
    component.instance.ticket = ticket;
    component.instance.closeTicket.pipe(
    ).subscribe(() => {
      ref.containerRef.clear();
    });
    return component;
  }
}
