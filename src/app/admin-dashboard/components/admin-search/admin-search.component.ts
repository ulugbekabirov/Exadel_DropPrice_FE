import { Component, Input, OnInit, } from '@angular/core';
import { SearchFacadeService } from '../../services/search-facade.service';

@Component({
  selector: 'app-admin-search',
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss']
})
export class AdminSearchComponent implements OnInit {
  @Input() searchTerm;

  constructor(
    private facade: SearchFacadeService
  ) {
  }

  ngOnInit(): void {
    // this.facade.searchCriteria$.pipe(
    //   take(1)).subscribe(
    //   criteria => {
    //     // this.searchTerm.patchValue(criteria.searchQuery, {emitEvent: false});
    //     // this.searchTerm.patchValue(criteria.sortBy, {emitEvent: false});
    //     // this.searchTerm.patchValue(criteria.take, {emitEvent: false});
    //     // this.searchTerm.patchValue(criteria.skip, {emitEvent: false});
    //   });
  }
}
