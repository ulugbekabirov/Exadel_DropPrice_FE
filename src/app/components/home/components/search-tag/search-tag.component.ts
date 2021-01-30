import { Component, OnInit, Input } from '@angular/core';
import { ApiDataService } from 'src/app/services/api-data.service';

@Component({
  selector: 'app-search-tag',
  templateUrl: './search-tag.component.html',
  styleUrls: ['./search-tag.component.scss'],
  providers: [ApiDataService]
})
export class SearchTagComponent implements OnInit {

  @Input() searchTagObj;

  newTags: string;
  tags: string[] = [
    'аквапарк',
    'бассейн',
    'боулинг',
    'велосипеды',
    'стрижка',
    'суши',
  ];
  constructor(private apiDataService: ApiDataService) {}

  ngOnInit(): void {}

  getCardsByTag(tag: string): void {
  }
}
