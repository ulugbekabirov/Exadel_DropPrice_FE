import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AuthInfo } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'InternshipFe';
  private activeUser: AuthInfo;

  constructor(private auth: AuthService) {
    this.auth.activeUser.subscribe(user => this.activeUser = user);
  }
}
