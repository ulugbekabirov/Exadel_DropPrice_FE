import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  color = 'primary';
  mode = 'indeterminate';
  value = 40;
  @Input()
  isLoading$: Observable<boolean>;
}