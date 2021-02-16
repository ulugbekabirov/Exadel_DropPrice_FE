import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActiveUser } from '../../../models';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent implements OnInit {
  @Input() activeUser: ActiveUser;

  constructor() {
  }

  ngOnInit(): void {
  }

}
