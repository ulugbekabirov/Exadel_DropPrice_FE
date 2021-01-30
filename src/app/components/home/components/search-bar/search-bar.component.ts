import { Component, OnInit, Input } from '@angular/core';
import { ApiDataService } from 'src/app/services/api-data.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [ApiDataService]
})
export class SearchBarComponent implements OnInit {
  
  @Input() searchBarObj;

  constructor() {}

  ngOnInit(): void {}


}
