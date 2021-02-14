import { Component, Input, OnInit } from '@angular/core';
import { SearchFacadeService } from '../../services/search-facade.service';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss']
})
export class AdminContentComponent implements OnInit {
  @Input() searchResults$;
  constructor(
    private facade: SearchFacadeService
  ) { }

  ngOnInit(): void {
  }

}
