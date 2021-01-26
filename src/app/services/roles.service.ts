import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private auth: AuthService) {}

  getRoles(): Observable<any> {
    return this.auth.activeUser;
  }
}
