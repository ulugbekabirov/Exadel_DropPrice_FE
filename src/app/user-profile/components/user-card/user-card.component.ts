import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ActiveUser } from '../../../models';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input() activeUser: ActiveUser;
  panelOpenState = false;
}
