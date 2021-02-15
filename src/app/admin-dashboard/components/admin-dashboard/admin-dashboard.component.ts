import { Component, OnInit } from '@angular/core';
import { SearchFacade } from '../../services/search-facade';
import { FormControl } from '@angular/forms';
import { SortStore } from '../../services/sort-store';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  searchTerm = new FormControl();
  ratingSort = new FormControl();
  ticketCountSort = new FormControl();
  collapseSidebar;
  take: 10;
  skip: 0;
  searchResults$ = this.facade.searchVendors();

  sortRating$: Observable<any>;
  sortTicketCount$: Observable<any>;

  constructor(
    private facade: SearchFacade,
    private sortStore: SortStore
  ) {
    this.sortRating$ = this.sortStore.sortRatingData$;
    this.sortTicketCount$ = this.sortStore.sortTicketCountData$;
  }

  ngOnInit(): void {
    this.ratingSort.valueChanges.subscribe(next => this.sortStore.setRatingSelected(next));
    this.ticketCountSort.valueChanges.subscribe(next => this.sortStore.setTicketCountSelected(next));
    this.searchTerm.valueChanges.subscribe(next => this.sortStore.setSearchQuery(next));
  }

  onWidthChange($event: any): void {
    this.collapseSidebar = $event;
  }
}
