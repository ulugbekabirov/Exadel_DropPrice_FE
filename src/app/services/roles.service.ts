import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private auth: AuthService) {}

  getRoles() {
    return this.auth.activeUser;
  }
}
