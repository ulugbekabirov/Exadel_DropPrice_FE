import { Component, OnInit } from '@angular/core';
import { SearchFacadeService } from '../../services/search-facade.service';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  searchTerm = new FormControl();
  collapseSidebar;
  take: 10;
  skip: 0;
  sortBy = ['asc'];
  search: any;
  searchResults$ = this.facade
    .searchVendors(
      this.searchTerm.valueChanges,
      of(this.sortBy),
      of(10),
      of(0)
    );

  constructor(
    private facade: SearchFacadeService
  ) {}

  ngOnInit(): void {
  }

  onWidthChange($event: any): void {
    this.collapseSidebar = $event;
  }
}
